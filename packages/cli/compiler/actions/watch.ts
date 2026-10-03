import { unlink } from 'fs/promises';
import { isAbsolute, relative, resolve, sep } from 'path';

import chokidar, { FSWatcher } from 'chokidar';

import { build } from './build';
import { BUILD_CONTEXT } from '../build-context';
import { createPacksOutputPathFromInputPath } from './utils/create-output-path';
import { loadConfig } from '../config/load-config';
import {
  getAffectedEntries,
  rebuildFiles,
  unlinkContentFile,
} from '../core/builder';
import { getGraphInputs } from '../core/graph';
import {
  flushLang,
  getLangStats,
  isLangInput,
  markLangDirty,
} from '../lang/lang-registry';
import { isFerolyteContentFile } from '../core/utils/is-content-file';
import {
  CompilerActionOptions,
  ContentBuildOptions,
  resolveCompilerOptions,
} from './options';
import {
  createFileEvent,
  createWatchReadyEvent,
  emitHook,
} from '../plugins/plugin-host';
import { getMinecraftHub } from '../scripts/start-minecraft-server';
import { copyWithPlugins } from '../plugins/write-with-plugins';
import { collectDiagnostics } from '../check/diagnostics-collector';
import { resetBuildMetrics } from '../core/build-metrics';
import { refreshRegistry } from '../registry/refresh';
import {
  formatClock,
  formatDiagnosticLine,
  formatWatchLine,
  shortPath,
  WatchBatchInfo,
} from '../utils/format-output';
import { logger } from '../utils/logger';
import { printDiagnostics } from '../utils/report';

type ChangeKind = 'add' | 'change' | 'unlink';

const DEBOUNCE_MS = 50;

/** First folder inside the pack: `textures`, `sounds`, ... */
const packRelative = (file: string): string => {
  for (const packRoot of [
    BUILD_CONTEXT.PACKS.INPUT_BEHAVIOR_PACK_PATH,
    BUILD_CONTEXT.PACKS.INPUT_RESOURCE_PACK_PATH,
  ]) {
    const rel = relative(packRoot, file);
    if (!rel.startsWith('..') && !isAbsolute(rel)) {
      return rel.split(sep)[0];
    }
  }

  return shortPath(file, process.cwd()).split('/')[0];
};

/** Short label of a changed file: `zombie.se.ts` or `shared/constants.ts`. */
const labelOf = (filePath: string, isEntry: boolean): string => {
  const parts = shortPath(filePath, process.cwd()).split('/');

  return isEntry ? parts[parts.length - 1] : parts.slice(-2).join('/');
};

/**
 * Handles a batch of file events: copies/removes non-content files, then
 * rebuilds every affected content entry in a single esbuild pass and prints
 * one summary line.
 */
const processBatch = async (
  batch: Map<string, ChangeKind>,
  buildOptions: ContentBuildOptions,
) => {
  const startTime = performance.now();
  const collector = collectDiagnostics({ silent: true });
  const rebuildTriggers: string[] = [];
  const addedPaths = new Set<string>();
  const copied: string[] = [];
  const removed: string[] = [];
  let unlinkedEntry: string | undefined;
  let langUpdated = false;
  let langInputChanged = false;
  const failures: string[] = [];

  try {
    for (const [filePath, kind] of batch) {
      try {
        if (kind === 'add') {
          addedPaths.add(filePath);
        }

        if (isLangInput(filePath)) {
          // texts/*.lang and languages.json are merged by the lang generator
          markLangDirty();
          langInputChanged = true;
        } else if (!filePath.endsWith('.ts')) {
          const outputPath = createPacksOutputPathFromInputPath(filePath);
          if (outputPath && kind === 'unlink') {
            await unlink(outputPath);
            removed.push(filePath);
            logger.verbose(`  🗑 ${filePath}\n    → ${logger.link(outputPath)}`);
            await emitHook(
              'afterFileRemove',
              createFileEvent(filePath, 'copy', outputPath),
            );
          } else if (outputPath) {
            const copyResult = await copyWithPlugins(filePath, outputPath);
            if (copyResult.written) {
              copied.push(filePath);
              logger.verbose(
                `  ⧉ ${filePath}\n    → ${logger.link(copyResult.destinationPath)}`,
              );
              await emitHook(
                kind === 'add' ? 'afterFileAdd' : 'afterFileUpdate',
                createFileEvent(filePath, 'copy', copyResult.destinationPath),
              );
            }
          }
        }

        if (kind === 'unlink' && isFerolyteContentFile(filePath)) {
          // Dependents must be resolved before the entry leaves the graph.
          rebuildTriggers.push(
            ...getAffectedEntries([filePath]).filter(
              (entry) => resolve(entry) !== resolve(filePath),
            ),
          );
          const outputPaths = await unlinkContentFile(filePath, buildOptions);
          unlinkedEntry = filePath;
          removed.push(...outputPaths);
          await emitHook(
            'afterFileRemove',
            createFileEvent(filePath, 'content', outputPaths),
          );
        } else {
          rebuildTriggers.push(filePath);
        }
      } catch (error) {
        failures.push(`${labelOf(filePath, false)}  ${String(error)}`);
      }
    }

    resetBuildMetrics();
    const affected = getAffectedEntries(rebuildTriggers);
    let results: Awaited<ReturnType<typeof rebuildFiles>> = [];
    try {
      results = await rebuildFiles(rebuildTriggers, buildOptions);
      for (const result of results) {
        await emitHook(
          addedPaths.has(resolve(result.source))
            ? 'afterFileAdd'
            : 'afterFileUpdate',
          createFileEvent(result.source, 'content', result.outFile),
        );
      }
    } catch (error) {
      failures.push(`rebuild  ${String(error)}`);
    }

    const langBefore = getLangStats();
    try {
      const langOutputs = await flushLang();
      const langAfter = getLangStats();
      // Only worth a segment when the key set changed or the user edited texts/*.lang.
      langUpdated =
        langOutputs.length > 0 &&
        (langInputChanged ||
          langBefore.keys !== langAfter.keys ||
          langBefore.locales !== langAfter.locales);
    } catch (error) {
      failures.push(`lang  ${String(error)}`);
    }

    try {
      await refreshRegistry({
        only: new Set(results.map((result) => resolve(result.source))),
      });
    } catch (error) {
      failures.push(`registry  ${String(error)}`);
    }

    const ms = performance.now() - startTime;
    collector.stop();
    const errorRecords = collector.records.filter((r) => r.severity === 'error');
    const color = logger.useColor;
    const root = process.cwd();

    const triggerEntries = rebuildTriggers.filter((file) =>
      affected.some((entry) => resolve(entry) === resolve(file)),
    );
    const contentChanged = affected.length > 0 || failures.length > 0;
    const single =
      rebuildTriggers.length === 1 ? rebuildTriggers[0] : undefined;
    const isEntry = single !== undefined && triggerEntries.length === 1;
    const firstError = errorRecords[0]
      ? (errorRecords[0].message.split(/\r?\n/)[0] ?? '').replace(/^[^\w"'(]+/, '')
      : failures[0];

    const info: WatchBatchInfo = {
      time: formatClock(),
      content: contentChanged
        ? {
            label:
              single !== undefined
                ? labelOf(single, isEntry)
                : `${rebuildTriggers.length} files`,
            isEntry: single === undefined || isEntry,
            dependents: Math.max(0, affected.length - triggerEntries.length),
            json: results.reduce(
              (sum, r) => sum + (Array.isArray(r.outFile) ? r.outFile.length : 1),
              0,
            ),
            ms,
            warnings: collector.warningCount(),
            error:
              errorRecords.length > 0 ||
              failures.length > 0 ||
              (affected.length > 0 && results.length === 0)
                ? firstError ?? 'build failed'
                : undefined,
          }
        : undefined,
      copied:
        copied.length > 0
          ? {
              count: copied.length,
              hint: `${packRelative(copied[0])}/…`,
            }
          : undefined,
      removed:
        unlinkedEntry !== undefined || removed.length > 0
          ? {
              count: removed.length,
              label:
                unlinkedEntry !== undefined
                  ? labelOf(unlinkedEntry, true)
                  : undefined,
            }
          : undefined,
      lang: langUpdated,
    };

    if (
      info.content === undefined &&
      !info.copied &&
      !info.removed &&
      !info.lang
    ) {
      return;
    }

    logger.info(formatWatchLine(info, { color }));
    // Details below the line: every diagnostic, then unexpected failures.
    printDiagnostics(
      collector.records.filter(
        (record) => record !== errorRecords[0] || errorRecords.length > 1,
      ),
      root,
    );
    for (const failure of failures.slice(info.content?.error ? 1 : 0)) {
      logger.error(`✖ ${failure}`);
    }
    results.forEach((result) => {
      const paths = Array.isArray(result.outFile) ? result.outFile : [result.outFile];
      logger.verbose(
        `  ${result.source}\n${paths.map((path) => `    → ${logger.link(path)}`).join('\n')}`,
      );
    });
  } finally {
    collector.stop();
  }
};

const isInside = (parent: string, child: string) => {
  const path = relative(parent, child);

  return path === '' || (!path.startsWith('..') && !isAbsolute(path));
};

/**
 * Graph inputs outside of the pack folders (shared code, aliases, imported JSON).
 */
export const getExtraWatchedInputs = (packRoots: string[]): Set<string> => {
  const roots = packRoots.map((path) => resolve(path));

  return new Set(
    getGraphInputs().filter(
      (file) => !roots.some((root) => isInside(root, file)),
    ),
  );
};

/**
 * Keeps chokidar in sync with the graph: every input outside of the pack
 * folders is watched too, and unwatched once nothing imports it.
 */
const createInputsSync = (watcher: FSWatcher) => {
  const extraInputs = new Set<string>();

  return () => {
    const outside = getExtraWatchedInputs([
      BUILD_CONTEXT.PACKS.INPUT_BEHAVIOR_PACK_PATH,
      BUILD_CONTEXT.PACKS.INPUT_RESOURCE_PACK_PATH,
    ]);

    for (const file of outside) {
      if (!extraInputs.has(file)) {
        extraInputs.add(file);
        watcher.add(file);
      }
    }
    for (const file of extraInputs) {
      if (!outside.has(file)) {
        extraInputs.delete(file);
        void watcher.unwatch(file);
      }
    }
  };
};

/**
 * Watches the packs and every file imported by content, then rebuilds the
 * affected content.
 */
export const watch = async (
  options: CompilerActionOptions,
): Promise<() => Promise<void>> => {
  const resolved = resolveCompilerOptions(options);
  const buildOptions: ContentBuildOptions = {
    debug: resolved.debug,
    diagnostics: resolved.diagnostics,
  };

  await loadConfig(resolved.profile);

  // The initial build also fills the dependency graph.
  await build({
    profile: resolved.profile,
    debug: resolved.debug,
    diagnostics: resolved.diagnostics,
  });

  const watcher = chokidar.watch(
    [
      BUILD_CONTEXT.PACKS.INPUT_BEHAVIOR_PACK_PATH,
      BUILD_CONTEXT.PACKS.INPUT_RESOURCE_PACK_PATH,
    ],
    {
      awaitWriteFinish: {
        stabilityThreshold: 500,
      },
      atomic: true,
      ignored: ['**/node_modules/**', '**/.git/**', '**/.ferolyte/**'],
      ignoreInitial: true,
      persistent: true,
    },
  );

  const syncInputs = createInputsSync(watcher);
  syncInputs();

  let pending = new Map<string, ChangeKind>();
  let timer: NodeJS.Timeout | undefined;
  let queue: Promise<void> = Promise.resolve();

  const flush = () => {
    timer = undefined;
    const batch = pending;
    pending = new Map();
    queue = queue
      .then(() => processBatch(batch, buildOptions))
      .then(() => {
        if (BUILD_CONTEXT.SERVER.RELOAD_ON_PACK_CHANGE) {
          getMinecraftHub()?.scheduleReload('packs');
        }
      })
      .then(syncInputs, syncInputs);
  };

  const enqueue = (kind: ChangeKind) => (filePath: string) => {
    const path = resolve(filePath);
    const previous = pending.get(path);
    // add + change stays an add; anything + unlink is an unlink.
    pending.set(path, kind === 'change' && previous ? previous : kind);
    clearTimeout(timer);
    timer = setTimeout(flush, DEBOUNCE_MS);
  };

  watcher
    .on('add', enqueue('add'))
    .on('change', enqueue('change'))
    .on('unlink', enqueue('unlink'))
    .on('addDir', (dirPath) => {
      watcher.add(dirPath);
    });

  await emitHook('afterWatchReady', createWatchReadyEvent());

  logger.info('Watching for changes… (Ctrl+C to stop)');

  return async () => {
    clearTimeout(timer);
    await queue;
    await watcher.close();
  };
};

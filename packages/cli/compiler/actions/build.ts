import { readdir, rm } from 'fs/promises';
import { join } from 'path';

import { BUILD_CONTEXT } from '../build-context';
import { CompilerActionOptions, resolveCompilerOptions } from './options';
import { loadConfig } from '../config/load-config';
import { createPacksOutputPathFromInputPath } from './utils/create-output-path';
import { FerolyteContentBuilder } from '../core/builder';
import { clearGraph } from '../core/graph';
import { settleAfterPass, settleIds } from '../registry/generate-types';
import { buildIndex, clearRegistry } from '../registry/project-registry';
import { runReferenceChecks } from '../registry/reference-checks';
import { DEFAULT_CONCURRENCY, mapLimit } from '../utils/map-limit';
import {
  clearAllLang,
  flushLang,
  isLangInput,
  markLangDirty,
} from '../lang/lang-registry';
import { isFerolyteContentFile } from '../core/utils/is-content-file';
import {
  createAfterLoadEvent,
  createBuildEvent,
  createFileEvent,
  emitAfterLoad,
  emitHook,
  scheduleAfterLoad,
} from '../plugins/plugin-host';
import { copyWithPlugins } from '../plugins/write-with-plugins';
import { clearAllContentOutputs } from '../content/utils/content-output-registry';
import { collectDiagnostics } from '../check/diagnostics-collector';
import type { ContentDiagnosticRecord } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { getBuildMetrics, resetBuildMetrics } from '../core/build-metrics';
import { getLangStats } from '../lang/lang-registry';
import { BuildStats, formatBuildSummary } from '../utils/format-output';
import { logger } from '../utils/logger';
import { printDiagnostics } from '../utils/report';

const SKIP_DIRECTORIES = new Set(['node_modules', '.git', '.ferolyte', 'dist']);

/**
 * Walks through a directory and yields all files.
 * @param dir - The directory to walk through.
 * @returns An async generator of file paths.
 */
export async function* walkFiles(dir: string): AsyncGenerator<string> {
  const files = await readdir(dir, { withFileTypes: true });

  for (const file of files) {
    const path = join(dir, file.name);
    if (file.isDirectory()) {
      if (SKIP_DIRECTORIES.has(file.name)) {
        continue;
      }

      yield* walkFiles(path);
    } else {
      yield path;
    }
  }
}

/**
 * Creates a build dictionary.
 * @returns A tuple containing the copy file paths and build file paths.
 */
const createBuildDictionary = async (): Promise<
  [Record<string, string>, string[]]
> => {
  const copyFilePaths: Record<string, string> = {};
  const buildFilePaths: string[] = [];

  const { INPUT_BEHAVIOR_PACK_PATH, INPUT_RESOURCE_PACK_PATH } =
    BUILD_CONTEXT.PACKS;

  for (const inputPath of [
    INPUT_BEHAVIOR_PACK_PATH,
    INPUT_RESOURCE_PACK_PATH,
  ]) {
    for await (const file of walkFiles(inputPath)) {
      if (isLangInput(file)) {
        // texts/*.lang and languages.json are merged by the lang generator
        markLangDirty();
      } else if (!file.endsWith('.ts')) {
        const outputPath = createPacksOutputPathFromInputPath(file);

        if (outputPath) {
          copyFilePaths[file] = outputPath;
        }
      } else if (isFerolyteContentFile(file)) {
        buildFilePaths.push(file);
      }
    }
  }

  return [copyFilePaths, buildFilePaths];
};

/**
 * Clears the build directory.
 */
const clearBuildDirectory = async () => {
  const { OUTPUT_BEHAVIOR_PACK_PATH, OUTPUT_RESOURCE_PACK_PATH } =
    BUILD_CONTEXT.PACKS;

  await Promise.all([
    rm(OUTPUT_BEHAVIOR_PACK_PATH, { recursive: true, force: true }),
    rm(OUTPUT_RESOURCE_PACK_PATH, { recursive: true, force: true }),
  ]);
};

/**
 * Builds the content and prints a summary (unless `--quiet`).
 * @returns Phase timings and counters of the build.
 */
export const build = async (options: CompilerActionOptions): Promise<BuildStats> => {
  const { profile, debug, diagnostics } = resolveCompilerOptions(options);
  const startTime = performance.now();

  await loadConfig(profile);
  // Diagnostics are reported as one line each after the build.
  const collector = collectDiagnostics({ silent: true });
  resetBuildMetrics();

  try {
    await emitHook('beforeBuild', createBuildEvent());
    await clearBuildDirectory();

    const [copyFilePaths, buildFilePaths] = await createBuildDictionary();

    clearGraph();
    clearAllLang();
    clearRegistry();
    // A missing ids file is bootstrapped first (placeholder ids), so content importing ids of other content evaluates.
    await settleIds();
    clearAllContentOutputs();

    const content = { json: 0, byType: {} as Record<string, number> };

    // Bundling (native esbuild threads) and copying (I/O) are independent: run both.
    const buildContent = async () => {
      const results = await FerolyteContentBuilder.buildFiles(buildFilePaths, {
        debug: false, // per-file output is shown with --verbose only
        diagnostics,
      });

      for (const result of results) {
        content.json += Array.isArray(result.outFile) ? result.outFile.length : 1;
        const type = BUILD_CONTEXT.PACKS.CONTENT_SUFFIX_REGISTRY.resolveContentFile(
          result.source,
        )?.contentType;
        if (type !== undefined) {
          content.byType[type] = (content.byType[type] ?? 0) + 1;
        }
      }

      await mapLimit(results, DEFAULT_CONCURRENCY, (result) =>
        emitHook(
          'afterFileAdd',
          createFileEvent(result.source, 'content', result.outFile),
        ),
      );

      return results.length;
    };

    // Bounded: thousands of pack files must not be opened at once (EMFILE).
    let copied = 0;
    const copyFiles = async () => {
      const copyStart = performance.now();
      await mapLimit(
        Object.entries(copyFilePaths),
        DEFAULT_CONCURRENCY,
        async ([source, destination]) => {
          const copyResult = await copyWithPlugins(source, destination);

          if (!copyResult.written) {
            return;
          }
          copied++;

          await emitHook(
            'afterFileAdd',
            createFileEvent(source, 'copy', copyResult.destinationPath),
          );
        },
      );

      return performance.now() - copyStart;
    };

    const [builtFiles, copyMs] = await Promise.all([buildContent(), copyFiles()]);

    // Generated ids (`.ferolyte/types/ids.ts`): when they changed, content that imports them saw stale ids and
    // is built again (only those files, with their old diagnostics dropped).
    await settleAfterPass(async (entries) => {
      entries.forEach((entry) => collector.discardFile(entry));
      const rebuilt = await FerolyteContentBuilder.buildFiles(entries, {
        debug: false,
        diagnostics,
      });
      await mapLimit(rebuilt, DEFAULT_CONCURRENCY, (result) =>
        emitHook(
          'afterFileAdd',
          createFileEvent(result.source, 'content', result.outFile),
        ),
      );
    });

    const langStart = performance.now();
    await flushLang({ force: true });
    const langMs = performance.now() - langStart;

    // Reference checks.
    runReferenceChecks(buildIndex());

    await emitHook('afterBuild', createBuildEvent());
    scheduleAfterLoad(
      createAfterLoadEvent({
        content: buildFilePaths,
        copy: Object.keys(copyFilePaths),
      }),
    );
    await emitAfterLoad();

    const metrics = getBuildMetrics();
    const lang = getLangStats();
    const stats: BuildStats = {
      profile,
      totalMs: performance.now() - startTime,
      content: {
        files: builtFiles,
        json: content.json,
        byType: content.byType,
        bundleMs: metrics.bundle,
        evalMs: metrics.eval,
        writeMs: metrics.write,
      },
      copy: { files: copied, ms: copyMs },
      lang: { ...lang, ms: langMs },
    };

    collector.stop();
    if (debug) {
      printBuildReport(stats, collector.records);
    }

    return stats;
  } finally {
    collector.stop();
  }
};

const printBuildReport = (
  stats: BuildStats,
  records: readonly ContentDiagnosticRecord[],
) => {
  const errors = records.filter((record) => record.severity === 'error').length;
  const warnings = records.length - errors;

  logger.info(
    formatBuildSummary(stats, { warnings, errors }, { color: logger.useColor }),
  );
  printDiagnostics(records);
};

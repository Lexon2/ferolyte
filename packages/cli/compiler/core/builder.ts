import { unlink } from 'fs/promises';
import { basename, resolve } from 'path';

import { reportContentFailure } from '@ferolyte/common/content/diagnostics/content-diagnostic';

import { bundleEntries, evaluateBundle } from './bundle';
import { getDependentEntries, hasEntry, removeEntry } from './graph';
import {
  buildContentJson,
  BuildContentJsonResult,
} from '../content/content.factory';
import { isFerolyteContentFile } from './utils/is-content-file';
import { createContentPath } from '../content/utils/create-content-path';
import {
  deleteAllContentOutputs,
  replaceContentOutputs,
} from '../content/utils/content-output-registry';
import { ContentBuildOptions } from '../actions/options';
import { DEFAULT_CONCURRENCY, mapLimit } from '../utils/map-limit';
import { logger } from '../utils/logger';
import { addPhaseTime } from './build-metrics';
import { removeSourceLang } from '../lang/lang-registry';
import { removeSourceDocuments } from '../registry/project-registry';

/** First useful line of an esbuild failure: `message (line:column)`. */
const describeBundleError = (error: unknown): string => {
  const first = (error as { errors?: Array<{ text: string; location?: { line: number; column: number } | null }> })
    .errors?.[0];
  if (first) {
    const place = first.location ? ` (${first.location.line}:${first.location.column})` : '';

    return `${first.text}${place}`;
  }

  return (String(error).split(/\r?\n/)[0] ?? '').trim();
};

/** Per-file output paths, shown with `--verbose` only. */
const logBuilt = (result: BuildContentJsonResult) => {
  const paths = Array.isArray(result.outFile)
    ? result.outFile
    : [result.outFile];
  logger.verbose(
    `  ${result.source}\n${paths.map((p) => `    → ${logger.link(p)}`).join('\n')}`,
  );
};

/**
 * Builds content files with a single esbuild pass; bundles are evaluated in
 * memory. Updates the dependency graph of every built entry.
 * @param filePaths - The content files to build.
 * @returns Results of the entries that were built successfully.
 */
export const buildFiles = async (
  filePaths: string[],
  options: ContentBuildOptions = { debug: true, diagnostics: true },
): Promise<BuildContentJsonResult[]> => {
  const { debug, diagnostics } = options;

  const bundleStart = performance.now();
  const { bundled, failed } = await bundleEntries(
    filePaths.map((file) => resolve(process.cwd(), file)),
  );
  addPhaseTime('bundle', performance.now() - bundleStart);

  for (const { entry, error } of failed) {
    reportContentFailure(entry, describeBundleError(error));
    logger.verbose(`✖ ${entry}
${String(error)}`);
  }

  const loopStart = performance.now();
  let evalTotal = 0;
  const results = await mapLimit(
    bundled,
    DEFAULT_CONCURRENCY,
    async ({ entry, code }) => {
      try {
        const evalStart = performance.now();
        const moduleExports = evaluateBundle(code, entry);
        evalTotal += performance.now() - evalStart;
        const buildResult = await buildContentJson(entry, moduleExports, {
          debug,
          diagnostics,
        });
        if (buildResult instanceof Error) {
          reportContentFailure(entry, buildResult.message);
          logger.verbose(buildResult.message.trim());

          return;
        }

        if (buildResult === undefined) {
          reportContentFailure(entry, 'Failed to build: no content was produced');
        } else {
          const outputs = Array.isArray(buildResult.outFile)
            ? buildResult.outFile
            : [buildResult.outFile];
          await replaceContentOutputs(entry, outputs);
        }

        return buildResult;
      } catch (error) {
        reportContentFailure(entry, String(error));
        logger.verbose(`✖ ${entry}\n${String(error)}`);
      }
    },
  );

  addPhaseTime('eval', evalTotal);
  addPhaseTime('write', Math.max(0, performance.now() - loopStart - evalTotal));

  const built = results.filter(
    (result): result is BuildContentJsonResult => result !== undefined,
  );

  built.forEach(logBuilt);

  return built;
};

/**
 * Builds a file using esbuild and evaluates it in memory.
 * @param filePath - The path to the file to build.
 */
export const buildFile = async (
  filePath: string,
  options: ContentBuildOptions = { debug: true, diagnostics: true },
): Promise<BuildContentJsonResult | undefined> => {
  const [result] = await buildFiles([filePath], options);

  return result;
};

/**
 * Content entries affected by a change of the given files: the dependents
 * known to the graph, plus the files themselves when they are new content files.
 */
export const getAffectedEntries = (filePaths: string[]): string[] => {
  const affected = new Set<string>();
  for (const filePath of filePaths) {
    const resolved = resolve(process.cwd(), filePath);
    for (const entry of getDependentEntries(resolved)) {
      affected.add(entry);
    }
    if (isFerolyteContentFile(resolved) && !hasEntry(resolved)) {
      affected.add(resolved);
    }
  }

  return [...affected];
};

/**
 * Rebuilds changed files and every content entry that depends on them in one pass.
 * @param filePaths - The changed files.
 */
export const rebuildFiles = (
  filePaths: string[],
  options: ContentBuildOptions = { debug: true, diagnostics: true },
): Promise<BuildContentJsonResult[]> =>
  buildFiles(getAffectedEntries(filePaths), options);

/**
 * Rebuilds a file and its dependents.
 * @param filePath - The path to the file to rebuild.
 */
export const rebuildFile = (
  filePath: string,
  options: ContentBuildOptions = { debug: true, diagnostics: true },
): Promise<BuildContentJsonResult[]> => rebuildFiles([filePath], options);

/**
 * Deletes a file and its dependencies.
 * @param filePath - The path to the file to delete.
 */
export const unlinkContentFile = async (
  filePath: string,
  options: ContentBuildOptions = { debug: true, diagnostics: true },
): Promise<string[]> => {
  const { debug } = options;
  let removedOutputs = await deleteAllContentOutputs(filePath);

  if (removedOutputs.length === 0) {
    const distPath = createContentPath(filePath);
    if (distPath) {
      try {
        await unlink(distPath);
        removedOutputs = [distPath];
      } catch (error) {
        if (debug) {
          logger.verbose(`✖ could not delete ${distPath}: ${String(error)}`);
        }
      }
    }
  }

  removeSourceLang(filePath);
  removeSourceDocuments(filePath);
  removeEntry(filePath);

  const filename = basename(filePath);
  if (debug && removedOutputs.length > 0) {
    logger.verbose(`🗑 ${filename}`);
  }

  return removedOutputs;
};

const FerolyteContentBuilder = {
  buildFile,
  buildFiles,
  rebuildFile,
  rebuildFiles,
  unlinkContentFile,
};

export { FerolyteContentBuilder };

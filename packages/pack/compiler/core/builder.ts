import { rm, unlink } from 'fs/promises';
import { basename, join } from 'path';
import { pathToFileURL } from 'url';

import * as esbuild from 'esbuild';

import { addFile, removeFile } from './graph';
import {
  buildContentJson,
  BuildContentJsonResult,
} from '../content/content.factory';
import { createEsbuildConfig } from './utils/build-esbuild-config';
import { isArtifexContentFile } from './utils/is-content-file';
import { getBuildCacheDistDir } from '../content/utils/build-cache-dist-dir';
import { createContentPath } from '../content/utils/create-content-path';

/**
 * Builds a file using esbuild and imports it.
 * @param filePath - The path to the file to build.
 * @returns A promise that resolves when the file is built and imported.
 */
export const buildFile = async (filePath: string, debug: boolean = true) => {
  const startTime = Date.now();
  const fileName = basename(filePath, '.ts') + Date.now().toString() + '.js';
  const outFile = join(getBuildCacheDistDir(), fileName);

  await esbuild.build(createEsbuildConfig(filePath, outFile));

  const url = pathToFileURL(outFile).toString();

  let result: BuildContentJsonResult | undefined;

  try {
    const buildResult = await buildContentJson(filePath, url, debug);
    if (buildResult instanceof Error) {
      console.error(buildResult.message);

      return;
    }

    result = buildResult;
  } catch (error) {
    if (debug) {
      console.error(`\n🛑 Error building file: ${error}\n`);
    }
  }

  await unlink(outFile);

  if (debug && result !== undefined) {
    const endTime = Date.now();
    const duration = endTime - startTime;

    const path = !Array.isArray(result.outFile)
      ? [result.outFile]
      : result.outFile;

    const link = path.map(
      (p) =>
        `\u001b]8;;file:///${p.replace(/\\/g, '/')}\u0007${p}\u001b]8;;\u0007`,
    );
    console.log(
      `\n✅ Built: ${result.source}\n   Path: ${link.join('\n         ')}\n   Time: ${duration}ms\n`,
    );
  }
};

/**
 * Rebuilds a file and its dependencies.
 * @param filePath - The path to the file to rebuild.
 * @returns A promise that resolves when the file and its dependencies are rebuilt.
 */
export const rebuildFile = async (filePath: string, debug: boolean = true) => {
  await rm(getBuildCacheDistDir(), { recursive: true, force: true });

  const filesToRebuild = await addFile(filePath);

  for (const file of [...filesToRebuild].filter(isArtifexContentFile)) {
    await buildFile(file, debug);
  }
};

/**
 * Deletes a file and its dependencies.
 * @param filePath - The path to the file to delete.
 */
export const unlinkContentFile = async (
  filePath: string,
  debug: boolean = true,
) => {
  const distPath = createContentPath(filePath);
  if (!distPath) {
    return;
  }

  try {
    await unlink(distPath);
  } catch (error) {
    if (debug) {
      console.error(`\n🛑 Error deleting file: ${error}\n`);
    }
  }

  removeFile(filePath);

  const filename = basename(filePath);
  if (debug) {
    console.log(`\n🗑️ Deleted: ${filename}\n`);
  }
};

const ArtifexContentBuilder = {
  buildFile,
  rebuildFile,
  unlinkContentFile,
};

export { ArtifexContentBuilder };

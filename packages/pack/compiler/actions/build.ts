import { copyFile, mkdir, readdir, rm } from 'fs/promises';
import { join, dirname } from 'path';

import { BUILD_CONTEXT } from '../build-context';
import { loadConfig } from '../config/load-config';
import { createPacksOutputPathFromInputPath } from './utils/create-output-path';
import { getBuildCacheDistDir } from '../content/utils/build-cache-dist-dir';
import { ArtifexContentBuilder } from '../core/builder';
import { isArtifexContentFile } from '../core/utils/is-content-file';

/**
 * Walks through a directory and yields all files.
 * @param dir - The directory to walk through.
 * @returns An async generator of file paths.
 */
async function* walkFiles(dir: string): AsyncGenerator<string> {
  const files = await readdir(dir, { withFileTypes: true });

  for (const file of files) {
    const path = join(dir, file.name);
    if (file.isDirectory()) {
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

  const { INPUT_BASE_PATH } = BUILD_CONTEXT.PACKS;

  for await (const file of walkFiles(INPUT_BASE_PATH)) {
    if (!file.endsWith('.ts')) {
      const outputPath: string = createPacksOutputPathFromInputPath(file);

      if (outputPath) {
        copyFilePaths[file] = outputPath;
      }
    } else if (isArtifexContentFile(file)) {
      buildFilePaths.push(file);
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
    rm(getBuildCacheDistDir(), { recursive: true, force: true }),
    rm(OUTPUT_BEHAVIOR_PACK_PATH, { recursive: true, force: true }),
    rm(OUTPUT_RESOURCE_PACK_PATH, { recursive: true, force: true }),
  ]);
};

/**
 * Builds the content.
 */
export const build = async (debug: boolean = true, profile: string) => {
  if (debug) {
    console.log('🔄 Building...');
  }
  const startTime = Date.now();

  await loadConfig(profile);
  await clearBuildDirectory();

  const [copyFilePaths, buildFilePaths] = await createBuildDictionary();

  for (const file of buildFilePaths) {
    await ArtifexContentBuilder.buildFile(file, debug);
  }

  for (const [source, destination] of Object.entries(copyFilePaths)) {
    const dir = dirname(destination);
    await mkdir(dir, { recursive: true });
    await copyFile(source, destination);
  }

  if (debug) {
    console.log(`🔄 Complete build in ${Date.now() - startTime}ms`);
  }
};

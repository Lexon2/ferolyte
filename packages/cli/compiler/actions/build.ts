import { readdir, rm } from 'fs/promises';
import { join } from 'path';

import { BUILD_CONTEXT } from '../build-context';
import { CompilerActionOptions, resolveCompilerOptions } from './options';
import { loadConfig } from '../config/load-config';
import { createPacksOutputPathFromInputPath } from './utils/create-output-path';
import { getBuildCacheDistDir } from '../content/utils/build-cache-dist-dir';
import { FerolyteContentBuilder } from '../core/builder';
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
import {
  clearAllSourceItemTextures,
  flushItemTextures,
} from '../content/items/item-texture-atlas';

const SKIP_DIRECTORIES = new Set(['node_modules', '.git', '.ferolyte', 'dist']);

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
      if (!file.endsWith('.ts')) {
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
    rm(getBuildCacheDistDir(), { recursive: true, force: true }),
    rm(OUTPUT_BEHAVIOR_PACK_PATH, { recursive: true, force: true }),
    rm(OUTPUT_RESOURCE_PACK_PATH, { recursive: true, force: true }),
  ]);
};

/**
 * Builds the content.
 */
export const build = async (options: CompilerActionOptions) => {
  const { profile, debug, diagnostics } = resolveCompilerOptions(options);

  if (debug) {
    console.log('🔄 Building...');
  }
  const startTime = Date.now();

  await loadConfig(profile);
  await emitHook('beforeBuild', createBuildEvent());
  await clearBuildDirectory();

  const [copyFilePaths, buildFilePaths] = await createBuildDictionary();

  clearAllContentOutputs();
  clearAllSourceItemTextures();

  await Promise.all(
    buildFilePaths.map(async (file) => {
      const result = await FerolyteContentBuilder.buildFile(file, {
        debug: false, // Initial build is not verbose
        diagnostics,
      });

      if (!result) {
        return;
      }

      await emitHook(
        'afterFileAdd',
        createFileEvent(file, 'content', result.outFile),
      );
    }),
  );

  await Promise.all(
    Object.entries(copyFilePaths).map(async ([source, destination]) => {
      const copyResult = await copyWithPlugins(source, destination);

      if (!copyResult.written) {
        return;
      }

      await emitHook(
        'afterFileAdd',
        createFileEvent(source, 'copy', copyResult.destinationPath),
      );
    }),
  );

  await flushItemTextures();

  await emitHook('afterBuild', createBuildEvent());
  scheduleAfterLoad(
    createAfterLoadEvent({
      content: buildFilePaths,
      copy: Object.keys(copyFilePaths),
    }),
  );
  await emitAfterLoad();

  if (debug) {
    console.log(`🔄 Complete build in ${Date.now() - startTime}ms`);
  }
};

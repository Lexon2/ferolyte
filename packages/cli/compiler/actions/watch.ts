import { copyFile, unlink } from 'fs/promises';

import chokidar from 'chokidar';

import { build } from './build';
import { BUILD_CONTEXT } from '../build-context';
import { createPacksOutputPathFromInputPath } from './utils/create-output-path';
import { loadConfig } from '../config/load-config';
import { rebuildFile, unlinkContentFile } from '../core/builder';
import { DependencyGraphActions } from '../core/graph';
import {
  CompilerActionOptions,
  ContentBuildOptions,
  resolveCompilerOptions,
} from './options';

const createProcessEdit =
  (buildOptions: ContentBuildOptions) => async (filePath: string) => {
    try {
      if (!filePath.endsWith('.ts')) {
        const outputPath = createPacksOutputPathFromInputPath(filePath);
        if (outputPath) {
          await copyFile(filePath, outputPath);
          console.log(`\n🔄 Copied ${filePath}\n       To ${outputPath}\n`);
        }
        return;
      }

      await rebuildFile(filePath, buildOptions);
    } catch {}
  };

const createProcessUnlink =
  (buildOptions: ContentBuildOptions) => async (filePath: string) => {
    try {
      if (!filePath.endsWith('.ts')) {
        const outputPath = createPacksOutputPathFromInputPath(filePath);
        if (outputPath) {
          await unlink(outputPath);
          console.log(`\n🔄 Deleted ${filePath}\n       To ${outputPath}\n`);
        }
        return;
      }

      await unlinkContentFile(filePath, buildOptions);
    } catch {}
  };

/**
 * Watches the input directory for changes and rebuilds the content.
 */
export const watch = async (options: CompilerActionOptions) => {
  const resolved = resolveCompilerOptions(options);
  const buildOptions: ContentBuildOptions = {
    debug: resolved.debug,
    diagnostics: resolved.diagnostics,
  };

  await loadConfig(resolved.profile);
  console.log('🔍 Building dependency graph...');
  await DependencyGraphActions.create();

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
      ignored: ['**/node_modules/**', '**/.git/**', '**/.artifex/**'],
      ignoreInitial: true,
      persistent: true,
    },
  );

  const processEdit = createProcessEdit(buildOptions);
  const processUnlink = createProcessUnlink(buildOptions);

  watcher
    .on('add', processEdit)
    .on('change', processEdit)
    .on('unlink', processUnlink)
    .on('addDir', (dirPath) => {
      watcher.add(dirPath);
    });

  console.log('🚀 Watcher is running');
};

import { unlink } from 'fs/promises';

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
import {
  createFileEvent,
  createWatchReadyEvent,
  emitHook,
} from '../plugins/plugin-host';
import { copyWithPlugins } from '../plugins/write-with-plugins';

const createProcessAdd =
  (buildOptions: ContentBuildOptions) => async (filePath: string) => {
    try {
      if (!filePath.endsWith('.ts')) {
        const outputPath = createPacksOutputPathFromInputPath(filePath);
        if (outputPath) {
          const copyResult = await copyWithPlugins(filePath, outputPath);
          if (copyResult.written) {
            console.log(
              `\n🔄 Copied ${filePath}\n       To ${copyResult.destinationPath}\n`,
            );
            await emitHook(
              'afterFileAdd',
              createFileEvent(filePath, 'copy', copyResult.destinationPath),
            );
          }
        }
        return;
      }

      const results = await rebuildFile(filePath, buildOptions);
      for (const result of results) {
        await emitHook(
          'afterFileAdd',
          createFileEvent(result.source, 'content', result.outFile),
        );
      }
    } catch {}
  };

const createProcessChange =
  (buildOptions: ContentBuildOptions) => async (filePath: string) => {
    try {
      if (!filePath.endsWith('.ts')) {
        const outputPath = createPacksOutputPathFromInputPath(filePath);
        if (outputPath) {
          const copyResult = await copyWithPlugins(filePath, outputPath);
          if (copyResult.written) {
            console.log(
              `\n🔄 Copied ${filePath}\n       To ${copyResult.destinationPath}\n`,
            );
            await emitHook(
              'afterFileUpdate',
              createFileEvent(filePath, 'copy', copyResult.destinationPath),
            );
          }
        }
        return;
      }

      const results = await rebuildFile(filePath, buildOptions);
      for (const result of results) {
        await emitHook(
          'afterFileUpdate',
          createFileEvent(result.source, 'content', result.outFile),
        );
      }
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
          await emitHook(
            'afterFileRemove',
            createFileEvent(filePath, 'copy', outputPath),
          );
        }
        return;
      }

      const outputPath = await unlinkContentFile(filePath, buildOptions);
      await emitHook(
        'afterFileRemove',
        createFileEvent(filePath, 'content', outputPath),
      );
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

  const processAdd = createProcessAdd(buildOptions);
  const processChange = createProcessChange(buildOptions);
  const processUnlink = createProcessUnlink(buildOptions);

  watcher
    .on('add', processAdd)
    .on('change', processChange)
    .on('unlink', processUnlink)
    .on('addDir', (dirPath) => {
      watcher.add(dirPath);
    });

  await emitHook('afterWatchReady', createWatchReadyEvent());

  console.log('🚀 Watcher is running');
};

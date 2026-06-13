import { copyFile, unlink } from 'fs/promises';

import chokidar from 'chokidar';

import { build } from './build';
import { BUILD_CONTEXT } from '../build-context';
import { createPacksOutputPathFromInputPath } from './utils/create-output-path';
import { loadConfig } from '../config/load-config';
import { rebuildFile, unlinkContentFile } from '../core/builder';
import { DependencyGraphActions } from '../core/graph';

const processEdit = async (filePath: string) => {
  try {
    if (!filePath.endsWith('.ts')) {
      const outputPath = createPacksOutputPathFromInputPath(filePath);
      if (outputPath) {
        await copyFile(filePath, outputPath);
        console.log(`\n🔄 Copied ${filePath}\n       To ${outputPath}\n`);
      }
      return;
    }

    await rebuildFile(filePath);
    // if (isArtifexContentFile(filePath)) {
    // }
  } catch {}
};

const processUnlink = async (filePath: string) => {
  try {
    if (!filePath.endsWith('.ts')) {
      const outputPath = createPacksOutputPathFromInputPath(filePath);
      if (outputPath) {
        await unlink(outputPath);
        console.log(`\n🔄 Deleted ${filePath}\n       To ${outputPath}\n`);
      }
      return;
    }

    await unlinkContentFile(filePath);
    // if (isArtifexContentFile(filePath)) {
    // }
  } catch {}
};

/**
 * Watches the input directory for changes and rebuilds the content.
 */
export const watch = async (profile: string) => {
  await loadConfig(profile);
  console.log('🔍 Building dependency graph...');
  await DependencyGraphActions.create();

  await build(false, profile);

  const process = chokidar.watch(BUILD_CONTEXT.PACKS.INPUT_BASE_PATH, {
    awaitWriteFinish: {
      stabilityThreshold: 500,
    },
    atomic: true,
    ignoreInitial: true,
    persistent: true,
  });

  process
    .on('add', processEdit)
    .on('change', processEdit)
    .on('unlink', processUnlink);

  console.log('🚀 Watcher is running');
};

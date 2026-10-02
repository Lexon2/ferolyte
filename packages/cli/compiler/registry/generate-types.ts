import { existsSync } from 'fs';

import { walkFiles } from '../actions/build';
import { BUILD_CONTEXT } from '../build-context';
import { loadConfig } from '../config/load-config';
import { isFerolyteContentFile } from '../core/utils/is-content-file';
import { inspectContentFile } from '../inspect/inspect-file';
import { initPlugins } from '../plugins/plugin-host';
import { clearRegistry } from './project-registry';
import { getIdsFilePath } from './ids-generator';
import { refreshRegistry } from './refresh';

/** Every content `.ts` file of the profile's packs. */
export const listContentFiles = async (): Promise<string[]> => {
  const files: string[] = [];
  for (const root of [
    BUILD_CONTEXT.PACKS.INPUT_BEHAVIOR_PACK_PATH,
    BUILD_CONTEXT.PACKS.INPUT_RESOURCE_PACK_PATH,
  ]) {
    if (!existsSync(root)) {
      continue;
    }
    for await (const file of walkFiles(root)) {
      if (file.endsWith('.ts') && isFerolyteContentFile(file)) {
        files.push(file);
      }
    }
  }

  return files;
};

/**
 * `ferolyte types`: compiles the content in memory (nothing but the ids file is
 * written) and regenerates `.ferolyte/types/ids.ts`.
 */
export const generateTypes = async (
  profile: string,
): Promise<{ file: string; files: number; written: boolean; failed: string[] }> => {
  await loadConfig(profile);
  initPlugins([], profile);
  clearRegistry();

  const failed: string[] = [];
  const files = await listContentFiles();
  for (const file of files) {
    const result = await inspectContentFile(file, { diagnostics: false });
    if (!result.ok) {
      failed.push(`${file}: ${result.message}`);
    }
  }

  const { idsWritten } = await refreshRegistry({ checks: false });

  return { file: getIdsFilePath(), files: files.length, written: idsWritten, failed };
};

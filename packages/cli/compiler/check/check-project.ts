import { existsSync } from 'fs';

import {
  reportContentFailure,
  reportDiagnosticRecord,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';

import { walkFiles } from '../actions/build';
import { BUILD_CONTEXT } from '../build-context';
import { loadConfig } from '../config/load-config';
import { isFerolyteContentFile } from '../core/utils/is-content-file';
import { inspectContentFile } from '../inspect/inspect-file';
import { initPlugins } from '../plugins/plugin-host';
import { runTypeCheck } from './typescript-check';
import { clearRegistry } from '../registry/project-registry';
import { refreshRegistry } from '../registry/refresh';

/** Exit codes of `ferolyte check`. */
export const CHECK_EXIT = {
  OK: 0,
  /** At least one error diagnostic or failed file. */
  ERRORS: 1,
  /** Missing or invalid config. */
  USAGE: 2,
} as const;

export interface CheckResult {
  files: number;
  /** `undefined` when the profile could not be loaded. */
  configError?: string;
}

/**
 * Compiles every content file of the profile in memory (nothing is written,
 * plugins are disabled) with diagnostics on. Results are reported through the
 * content diagnostic sink, so attach a collector before calling.
 */
export const checkProject = async (
  profile: string,
  options: { types?: boolean } = {},
): Promise<CheckResult> => {
  try {
    await loadConfig(profile);
  } catch (error) {
    return {
      files: 0,
      configError: error instanceof Error ? error.message : String(error),
    };
  }
  initPlugins([], profile);

  const { INPUT_BEHAVIOR_PACK_PATH, INPUT_RESOURCE_PACK_PATH } =
    BUILD_CONTEXT.PACKS;
  const files: string[] = [];

  for (const root of [INPUT_BEHAVIOR_PACK_PATH, INPUT_RESOURCE_PACK_PATH]) {
    if (!existsSync(root)) {
      continue;
    }

    for await (const file of walkFiles(root)) {
      if (file.endsWith('.ts') && isFerolyteContentFile(file)) {
        files.push(file);
      }
    }
  }

  clearRegistry();
  for (const file of files) {
    const result = await inspectContentFile(file, { diagnostics: true });
    if (!result.ok) {
      reportContentFailure(file, result.message);
    }
  }

  // Reference checks between content and pack files (nothing is written).
  await refreshRegistry({ ids: false });

  if (options.types) {
    const records = await runTypeCheck({
      cwd: process.cwd(),
      tsconfig: BUILD_CONTEXT.TS.CONFIG_PATH || undefined,
    });
    records.forEach(reportDiagnosticRecord);
  }

  return { files: files.length };
};

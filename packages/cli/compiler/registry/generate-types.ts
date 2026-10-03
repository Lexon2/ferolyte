import { existsSync } from 'fs';

import { walkFiles } from '../actions/build';
import { getDependentEntries } from '../core/graph';
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

const MAX_ROUNDS = 3;

interface SettleResult {
  files: number;
  written: boolean;
  failed: string[];
}

/**
 * Brings `.ferolyte/types/ids.ts` up to date by evaluating the content in memory (no diagnostics, nothing else is written).
 * Without an ids file the first round resolves `@ferolyte/ids` to placeholders, so content that imports ids of other content
 * (even mutually) still evaluates; the next rounds use the ids written by the previous one until they stop changing.
 * Does nothing when the ids file exists, unless `force` is set: the real pass of `check` / `run` then re-evaluates only
 * the files that import the ids when they changed (`settleAfterPass`).
 */
export const settleIds = async (
  options: { force?: boolean } = {},
): Promise<SettleResult> => {
  if (!options.force && existsSync(getIdsFilePath())) {
    return { files: 0, written: false, failed: [] };
  }

  const files = await listContentFiles();
  let placeholder = !existsSync(getIdsFilePath());
  let written = false;
  let failed: string[] = [];

  for (let round = 0; round < MAX_ROUNDS; round++) {
    clearRegistry();
    failed = [];
    for (const file of files) {
      const result = await inspectContentFile(file, {
        diagnostics: false,
        placeholderIds: placeholder,
      });
      if (!result.ok) {
        failed.push(`${file}: ${result.message}`);
      }
    }
    placeholder = false;

    const { idsWritten } = await refreshRegistry({ checks: false });
    written ||= idsWritten;
    if (!idsWritten) {
      break;
    }
  }
  clearRegistry();

  return { files: files.length, written, failed };
};

/**
 * After the real pass of `check` / `run`: writes the ids file; when the ids changed, the content that imports it
 * (known from the dependency graph) saw stale ids, so `reevaluate` runs for those entries only, until the ids are stable.
 * @returns the entries that were evaluated again.
 */
export const settleAfterPass = async (
  reevaluate: (entries: string[]) => Promise<void>,
  maxRounds = 2,
): Promise<string[]> => {
  const again = new Set<string>();
  for (let round = 0; round <= maxRounds; round++) {
    const { idsWritten } = await refreshRegistry({ checks: false });
    if (!idsWritten || round === maxRounds) {
      break;
    }
    const dependents = [...getDependentEntries(getIdsFilePath())];
    if (dependents.length === 0) {
      break;
    }
    dependents.forEach((entry) => again.add(entry));
    await reevaluate(dependents);
  }

  return [...again];
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

  const result = await settleIds({ force: true });

  return { file: getIdsFilePath(), ...result };
};

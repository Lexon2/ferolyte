import { readdir, readFile, stat } from 'fs/promises';
import { join } from 'path';

import { BUILD_CONTEXT } from '../build-context';
import { AnimationDefinition } from './animation-options';
import { parseJsonc } from '../utils/read-jsonc';

export interface IndexedAnimation {
  /** Source `.animation.json` file. */
  file: string;
  format_version?: string;
  definition: AnimationDefinition;
}

interface IndexedFile {
  mtimeMs: number;
  format_version?: string;
  animations: Record<string, AnimationDefinition>;
}

const files = new Map<string, IndexedFile>();

export const clearAnimationIndex = (): void => {
  files.clear();
};

const walkJson = async (dir: string): Promise<string[]> => {
  const result: string[] = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return result;
  }

  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...(await walkJson(path)));
    } else if (entry.name.endsWith('.json')) {
      result.push(path);
    }
  }

  return result;
};

/**
 * Index `animation id -> source` of the RP `animations/**\/*.json` files (JSONC).
 * Files are re-read only when their modification time changes.
 */
export const getAnimationIndex = async (): Promise<
  Map<string, IndexedAnimation>
> => {
  const root = join(BUILD_CONTEXT.PACKS.INPUT_RESOURCE_PACK_PATH, 'animations');
  const current = await walkJson(root);
  const seen = new Set(current);

  for (const known of [...files.keys()]) {
    if (!seen.has(known)) {
      files.delete(known);
    }
  }

  await Promise.all(
    current.map(async (file) => {
      const { mtimeMs } = await stat(file);
      if (files.get(file)?.mtimeMs === mtimeMs) {
        return;
      }

      const parsed = parseJsonc(await readFile(file, 'utf-8'));
      const value = parsed.ok ? (parsed.value as Record<string, unknown>) : undefined;
      const animations =
        value && typeof value.animations === 'object' && value.animations
          ? (value.animations as Record<string, AnimationDefinition>)
          : {};
      files.set(file, {
        mtimeMs,
        format_version:
          typeof value?.format_version === 'string' ? value.format_version : undefined,
        animations,
      });
    }),
  );

  const index = new Map<string, IndexedAnimation>();
  for (const [file, data] of files) {
    for (const [id, definition] of Object.entries(data.animations)) {
      index.set(id, { file, format_version: data.format_version, definition });
    }
  }

  return index;
};

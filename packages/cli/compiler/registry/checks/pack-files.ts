import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import {
  ContentDiagnosticSeverity,
  reportDiagnosticRecord,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { BUILD_CONTEXT } from '../../build-context';
import { createManifestScriptEntry } from '../../utils/namespace-path';
import { parseJsonc } from '../../utils/read-jsonc';
import type { ReferenceCheck } from './index';

const record = (
  file: string,
  contentType: string,
  fieldPath: string,
  message: string,
  severity: ContentDiagnosticSeverity,
): void =>
  reportDiagnosticRecord({ file, contentType, component: '', fieldPath, message, severity });

const normalizeEntry = (entry: string): string =>
  entry.replace(/\\/g, '/').replace(/^\.\//, '');

/**
 * The scripts bundle is written to `scripts/<namespace, "_" → "/">/index.js`; a BP `manifest.json` is copied as is.
 * A script module whose `entry` is neither the bundle nor a file of the input BP points at nothing: the game runs no
 * scripts. That is an error naming both paths. An entry that is a hand-written file of the BP while a scripts entry
 * exists too is a warning (the bundle is not loaded).
 */
export const checkManifestScriptEntry = (
  manifestPath: string,
  manifest: unknown,
  options: { namespace: string; inputBehaviorPack: string; hasScriptEntry: boolean },
): void => {
  const modules = (manifest as { modules?: unknown })?.modules;
  if (!Array.isArray(modules)) {
    return;
  }
  const bundle = createManifestScriptEntry(options.namespace);
  modules.forEach((module, index) => {
    if (module?.type !== 'script' || typeof module.entry !== 'string') {
      return;
    }
    const entry = normalizeEntry(module.entry);
    if (entry === bundle) {
      return;
    }
    const fieldPath = `modules[${index}].entry`;
    if (existsSync(join(options.inputBehaviorPack, entry))) {
      if (options.hasScriptEntry) {
        record(
          manifestPath,
          'manifest',
          fieldPath,
          `script entry "${entry}" is a file of the pack, so the scripts bundle "${bundle}" is not loaded`,
          'warning',
        );
      }

      return;
    }
    record(
      manifestPath,
      'manifest',
      fieldPath,
      `script entry "${entry}" does not exist in the output; the scripts bundle is written to "${bundle}" (namespace "${options.namespace}"). Set "entry": "${bundle}"`,
      'error',
    );
  });
};

/** BP `manifest.json`: the script module entry must be the bundle path (or a file of the pack). */
export const manifestCheck: ReferenceCheck = (_index, only) => {
  const { INPUT_BEHAVIOR_PACK_PATH, NAMESPACE, SCRIPT_ENTRY_PATH } = BUILD_CONTEXT.PACKS;
  const manifestPath = join(INPUT_BEHAVIOR_PACK_PATH, 'manifest.json');
  if ((only && !only.has(manifestPath)) || !existsSync(manifestPath)) {
    return;
  }
  const parsed = parseJsonc(readFileSync(manifestPath, 'utf-8'));
  if (!parsed.ok) {
    return;
  }
  checkManifestScriptEntry(manifestPath, parsed.value, {
    namespace: NAMESPACE,
    inputBehaviorPack: INPUT_BEHAVIOR_PACK_PATH,
    hasScriptEntry: SCRIPT_ENTRY_PATH !== '' && existsSync(SCRIPT_ENTRY_PATH),
  });
};

/**
 * Plain JSON items and blocks are copied as is: a `menu_category.group` without a namespace makes the game reject
 * the whole item (`.ts` content gets the `minecraft:` prefix from the builder).
 */
export const menuGroupCheck: ReferenceCheck = (index, only) => {
  for (const document of index.documents) {
    if (
      (document.kind !== 'item' && document.kind !== 'block') ||
      !document.source.endsWith('.json') ||
      (only && !only.has(document.source))
    ) {
      continue;
    }
    const root = document.kind === 'item' ? 'minecraft:item' : 'minecraft:block';
    const group = document.json?.[root]?.description?.menu_category?.group;
    if (typeof group === 'string' && !group.includes(':')) {
      record(
        document.source,
        document.kind,
        'description.menu_category.group',
        `menu_category.group "${group}" must be prefixed with a namespace (e.g. "minecraft:${group}"); the game rejects the ${document.kind}`,
        'error',
      );
    }
  }
};

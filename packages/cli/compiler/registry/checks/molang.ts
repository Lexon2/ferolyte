import { lintMolang } from '@ferolyte/pack/content/molang/lint-molang';
import { report, walk } from './shared';
import type { ReferenceCheck } from './index';

/**
 * Molang mistakes the game loads silently (`!` applied to one side of a comparison or to a string literal),
 * in every string of the built documents: entities, client entities, attachables, render controllers, items,
 * blocks and animation controllers built from `.ts`.
 */
export const molangCheck: ReferenceCheck = (index, only) => {
  for (const document of index.documents) {
    if (only && !only.has(document.source)) {
      continue;
    }
    walk(document.json, '', (node, path) => {
      for (const [key, value] of Object.entries(node)) {
        if (typeof value !== 'string' || !value.includes('!')) {
          continue;
        }
        const fieldPath = path ? `${path}.${key}` : key;
        for (const message of lintMolang(value)) {
          report(document, fieldPath, `"${value}": ${message}`);
        }
      }
    });
  }
};

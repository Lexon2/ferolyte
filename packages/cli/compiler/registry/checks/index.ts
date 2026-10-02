import type { RegistryIndex } from '../project-registry';
import { checkRecipeDocument, projectNamespaces } from './recipe';
import { renderControllerCheck } from './render-controller';
import { checkSpawnRuleDocument } from './spawn-rule';

/**
 * A reference check that looks at the whole registry (cross-document checks, or checks of a document kind
 * that has no entry in `runReferenceChecks`' per-document switch). `only` limits the work to documents of
 * these source files (watch batches); `undefined` means everything.
 */
export type ReferenceCheck = (
  index: RegistryIndex,
  only?: ReadonlySet<string>,
) => void;

/** Recipe item references and spawn rule entity references (per document, limited to `only`). */
const recipeAndSpawnRuleChecks: ReferenceCheck = (index, only) => {
  const namespaces = projectNamespaces(index);

  for (const document of index.documents) {
    if (only && !only.has(document.source)) {
      continue;
    }
    if (document.kind === 'recipe') {
      checkRecipeDocument(document, index, { namespaces });
    } else if (document.kind === 'spawn-rule') {
      checkSpawnRuleDocument(document, index, { namespaces });
    }
  }
};

/**
 * Registry of reference checks, run after the per-document checks. To add a check:
 * write `checks/<name>.ts` exporting a `ReferenceCheck` and append it here.
 */
export const REFERENCE_CHECKS: ReferenceCheck[] = [
  renderControllerCheck,
  recipeAndSpawnRuleChecks,
];

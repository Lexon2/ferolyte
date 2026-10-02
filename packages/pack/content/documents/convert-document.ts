import type { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import type { AttachableDocument } from '../generated/attachable/documents';
import { attachableDocumentRegistry } from '../generated/attachable/registry';
import type { GeneratedEntry } from '../generated/key-map';
import type { RecipeDocument } from '../generated/recipe/documents';
import { recipeDocumentRegistry } from '../generated/recipe/registry';
import type { RenderControllerDocument } from '../generated/render-controller/documents';
import { renderControllerDocumentRegistry } from '../generated/render-controller/registry';
import { convertGeneratedValue } from '../generated/runtime';
import type { SpawnRuleDocument } from '../generated/spawn-rule/documents';
import { spawnRuleDocumentRegistry } from '../generated/spawn-rule/registry';
import { entityNormalizers } from '../server-entity/convertors/generated-entity';

/** SDK config of every document kind (camelCase mirror of the JSON file, generated from the schemas). */
export interface DocumentConfigs {
  attachable: AttachableDocument;
  renderController: RenderControllerDocument;
  recipe: RecipeDocument;
  spawnRule: SpawnRuleDocument;
}

export type DocumentKind = keyof DocumentConfigs;

export const documentRegistry: Record<DocumentKind, GeneratedEntry> = {
  attachable: attachableDocumentRegistry.attachable,
  renderController: renderControllerDocumentRegistry.renderController,
  recipe: recipeDocumentRegistry.recipe,
  spawnRule: spawnRuleDocumentRegistry.spawnRule,
};

export interface ConvertDocumentOptions {
  /** Used when the config has no `formatVersion`. */
  formatVersion?: string;
}

/**
 * Converts a whole content document (attachable, render controller, recipe, spawn rule) with the
 * schema-generated runtime: normalize → rename (camelCase → snake_case) → validate.
 * Unknown fields are reported and not written; invalid values are reported and kept. Diagnostics go through `ctx`
 * and use the camelCase paths of the config. The format version drives the field lifecycle markers.
 */
export const convertDocument = <K extends DocumentKind>(
  kind: K,
  config: Partial<DocumentConfigs[K]>,
  ctx?: ContentDiagnosticContext,
  options: ConvertDocumentOptions = {},
): Record<string, unknown> => {
  const entry = documentRegistry[kind];
  const withVersion: Record<string, unknown> = {
    ...(options.formatVersion !== undefined
      ? { formatVersion: options.formatVersion }
      : {}),
    ...(config as Record<string, unknown>),
  };
  const formatVersion =
    typeof withVersion.formatVersion === 'string'
      ? withVersion.formatVersion
      : undefined;

  return convertGeneratedValue(
    entry,
    withVersion,
    entityNormalizers,
    ctx === undefined ? undefined : { ...ctx, formatVersion },
  ) as Record<string, unknown>;
};

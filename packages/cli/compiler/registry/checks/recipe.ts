import {
  ContentDiagnosticContext,
  logContentError,
  logContentWarning,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { BUILD_CONTEXT } from '../../build-context';
import {
  isStrictReferences,
  ProjectDocument,
  RegistryIndex,
} from '../project-registry';
import { unknownMessage } from '../suggest';

/** Where a registry check reports to; defaults to the project diagnostics (warnings, errors with `--strict`). */
export interface RegistryCheckContext {
  report?: (fieldPath: string, message: string) => void;
  /** Namespaces of this project; defaults to the pack namespace plus the namespaces of every project id. */
  namespaces?: ReadonlySet<string>;
}

export const projectNamespaces = (index: RegistryIndex): Set<string> => {
  const out = new Set<string>();
  const add = (id: string) => {
    const colon = id.indexOf(':');
    if (colon > 0) {
      out.add(id.slice(0, colon));
    }
  };
  index.items.forEach(add);
  index.entities.forEach((_, id) => add(id));
  index.blocks.forEach((_, id) => add(id));
  const pack = BUILD_CONTEXT.PACKS.NAMESPACE?.toLowerCase();
  if (pack) {
    out.add(pack);
  }
  out.delete('minecraft');

  return out;
};

export const defaultReporter =
  (document: ProjectDocument) =>
  (fieldPath: string, message: string): void => {
    const ctx: ContentDiagnosticContext = {
      sourceFile: document.source,
      contentType: document.kind,
      fieldPath,
      diagnostics: true,
    };
    (isStrictReferences() ? logContentError : logContentWarning)(ctx, message);
  };

/** `{ item }` / `{ tag }` / plain string → item id (tags and non-strings give `undefined`). */
const itemId = (value: unknown): string | undefined =>
  typeof value === 'string'
    ? value
    : typeof (value as { item?: unknown })?.item === 'string'
      ? (value as { item: string }).item
      : undefined;

const tagOf = (value: unknown): string | undefined =>
  typeof (value as { tag?: unknown })?.tag === 'string'
    ? (value as { tag: string }).tag
    : undefined;

const asList = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : value === undefined ? [] : [value];

/** Item fields of every recipe kind: `[field path, value]`. */
const itemFields = (kind: string, recipe: any): [string, unknown][] => {
  const out: [string, unknown][] = [];
  const add = (path: string, value: unknown) =>
    asList(value).forEach((item, index) =>
      out.push([Array.isArray(value) ? `${path}[${index}]` : path, item]),
    );

  switch (kind) {
    case 'minecraft:recipe_shaped':
      Object.entries(recipe.key ?? {}).forEach(([symbol, item]) =>
        out.push([`key.${symbol}`, item]),
      );
      add('result', recipe.result);
      break;
    case 'minecraft:recipe_shapeless':
      add('ingredients', recipe.ingredients);
      add('result', recipe.result);
      break;
    case 'minecraft:recipe_furnace':
      add('input', recipe.input);
      add('output', recipe.output);
      break;
    case 'minecraft:recipe_smithing_transform':
    case 'minecraft:recipe_smithing_trim':
      for (const field of ['template', 'base', 'addition', 'result']) {
        add(field, recipe[field]);
      }
      break;
    // Brewing recipes use potion ids that are not registry items.
    default:
      break;
  }
  asList(recipe.unlock).forEach((item, index) => {
    if (typeof item === 'object' && item !== null && !('context' in item)) {
      out.push([`unlock[${index}]`, item]);
    }
  });

  return out;
};

/**
 * Recipe references: result and ingredient items/blocks that look project-owned (namespace of this project)
 * must exist; vanilla ids are never checked. Item tags must be `namespace:name`.
 */
export const checkRecipeDocument = (
  document: ProjectDocument,
  index: RegistryIndex,
  ctx: RegistryCheckContext = {},
): void => {
  const report = ctx.report ?? defaultReporter(document);
  const namespaces = ctx.namespaces ?? projectNamespaces(index);
  const known = new Set<string>([...index.items, ...index.blocks.keys()]);

  for (const [kind, recipe] of Object.entries(document.json ?? {})) {
    if (!kind.startsWith('minecraft:recipe_') || recipe === null || typeof recipe !== 'object') {
      continue;
    }
    for (const [fieldPath, value] of itemFields(kind, recipe)) {
      const id = itemId(value);
      if (id !== undefined) {
        // `ns:item:2` (legacy data suffix) names the item `ns:item`.
        const name = id.replace(/^([^:]+:[^:]+):\d+$/, '$1');
        const namespace = name.slice(0, name.indexOf(':'));
        if (namespaces.has(namespace) && !known.has(name)) {
          report(
            `${kind}.${fieldPath}`,
            unknownMessage(
              'item or block',
              name,
              [...known].filter((candidate) => candidate.startsWith(`${namespace}:`)),
            ),
          );
        }
      }
      const tag = tagOf(value);
      if (tag !== undefined && !/^[a-z0-9_.-]+:[a-z0-9_./-]+$/.test(tag)) {
        report(
          `${kind}.${fieldPath}`,
          `item tag "${tag}" must be written as "namespace:name"`,
        );
      }
    }
  }
};

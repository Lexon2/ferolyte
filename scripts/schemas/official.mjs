// Reader for the official Mojang JSON schemas (`Mojang/bedrock-samples/metadata/json_schemas/server`).
// The layout is delta based: `<area>/<version>/` only holds files introduced/changed in that version, every
// version directory has a full component index whose `$ref`s point into older directories.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const OFFICIAL_DIR = path.join(ROOT, '.cache/bedrock-samples/metadata/json_schemas/server');

export const compareVersions = (a, b) => {
  const [x, y] = [a, b].map((v) => v.split('.').map(Number));
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const d = (x[i] ?? 0) - (y[i] ?? 0);
    if (d !== 0) return d;
  }

  return 0;
};

const INDEX_NAMES = {
  entity: () => 'Entity component definitions.json',
  item: (dir) => (existsSync(path.join(dir, 'Item Components.json')) ? 'Item Components.json' : undefined),
  block: (dir) => (existsSync(path.join(dir, 'Components.json')) ? 'Components.json' : undefined),
};

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));

/** Versions of an area that have a component index, oldest first (`beta` is excluded). */
export const officialVersions = (area) => {
  const base = path.join(OFFICIAL_DIR, area);

  return readdirSync(base)
    .filter((v) => /^\d/.test(v) && INDEX_NAMES[area](path.join(base, v)) !== undefined)
    .sort(compareVersions);
};

/** `component key → schema file (or undefined: no body)` of the index of one version. */
export const officialIndex = (area, version) => {
  const dir = path.join(OFFICIAL_DIR, area, version);
  const file = path.join(dir, INDEX_NAMES[area](dir));
  const out = new Map();
  for (const [key, value] of Object.entries(readJson(file).properties ?? {})) {
    out.set(key, value.$ref ? path.resolve(dir, decodeURIComponent(value.$ref)) : undefined);
  }

  return out;
};

/** Shared official files that the SDK models with its own markers. */
const SHARED = [
  [/(Float|Int)Range\.json$/, 'range-object'],
  [/Filters?\.json$/, 'filters'],
];

/**
 * Official schema file → plain inline JSON schema (refs resolved, recursion cut).
 * Shared ranges/filters become `x-shared` markers, like the Blockception resolver does.
 */
export const resolveInline = (file, stack = [], root = undefined) => {
  const walk = (node, from, depth) => {
    if (Array.isArray(node)) return node.map((n) => walk(n, from, depth));
    if (node === null || typeof node !== 'object') return node;
    if (typeof node.$ref === 'string' && !node.$ref.startsWith('#')) {
      const target = path.resolve(path.dirname(from), decodeURIComponent(node.$ref.split('#')[0]));
      const shared = SHARED.find(([re]) => re.test(target));
      const siblings = Object.fromEntries(
        Object.entries(node).filter(([k]) => !['$ref', 'x-underlying-type', 'x-ordinal-index'].includes(k)),
      );
      if (shared) return { 'x-shared': shared[1], ...siblings };
      if (stack.includes(target) || depth > 12 || !existsSync(target)) return { 'x-recursive': true, ...siblings };
      const resolved = resolveInline(target, [...stack, target]);

      return { ...resolved, ...siblings };
    }

    return Object.fromEntries(
      Object.entries(node)
        .filter(([k]) => !['x-underlying-type', 'x-ordinal-index', '$id', '$schema', 'x-format-version'].includes(k))
        .map(([k, v]) => [k, walk(v, from, depth + 1)]),
    );
  };

  return walk(root ?? readJson(file), file, 0);
};

/** Inline-resolves one node (e.g. a property schema) of an official file. */
export const resolveNode = (node, file) => resolveInline(file, [file], node);

/** Top-level property names of an official component schema file. */
export const propertyNames = (file) => {
  if (file === undefined || !existsSync(file)) return undefined;
  const schema = readJson(file);
  const parts = [schema, ...(schema.allOf ?? []), ...(schema.oneOf ?? []), ...(schema.anyOf ?? [])];

  return new Set(parts.flatMap((part) => Object.keys(part.properties ?? {})));
};

/** Property history: `field → versions of the index in which the component schema has it`. */
export const fieldHistory = (area, key) => {
  const history = new Map();
  const versions = officialVersions(area);
  for (const version of versions) {
    const index = officialIndex(area, version);
    const props = propertyNames(index.get(key));
    if (props === undefined) continue;
    for (const p of props) history.set(p, [...(history.get(p) ?? []), version]);
  }

  return { history, versions };
};

/** Components of an area that appear in at least one official index, with the first/last version. */
export const componentPresence = (area) => {
  const presence = new Map();
  for (const version of officialVersions(area)) {
    for (const key of officialIndex(area, version).keys()) {
      presence.set(key, [...(presence.get(key) ?? []), version]);
    }
  }

  return presence;
};

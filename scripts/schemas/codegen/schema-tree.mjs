// Resolves the Blockception source schemas into self-contained trees.
// Shared types that the SDK models by hand (filters, triggers, ranges, Molang) are not inlined:
// they become `{ "x-shared": "<name>" }` markers that the emitters/runtime understand.
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { parse } from 'jsonc-parser';

/** Resolved-file suffix → shared marker. */
const SHARED = [
  ['filters/filters.json', 'filters'],
  ['types/trigger.json', 'trigger'],
  ['types/event.json', 'trigger'],
  ['types/event_object.json', 'trigger'],
  ['general/min_max_float.json', 'range-object'],
  ['general/min_max_int.json', 'range-object'],
  ['types/range_number_type.json', 'range-any'],
  ['general/int_or_range.json', 'range-int-or-object'],
  ['molang/string.json', 'molang'],
  ['molang/number.json', 'molang-number'],
];

/** Keywords kept in the validation schema (documentation keywords are dropped). */
const DOC_KEYS = new Set([
  'title',
  'examples',
  '$comment',
  'defaultSnippets',
  '$id',
  '$schema',
  'markdownDescription',
]);

export const createLoader = (schemasRoot, sharedPatchesDir) => {
  const files = new Map();
  const readSchema = (file) => {
    if (!files.has(file)) {
      let doc = parse(readFileSync(file, 'utf8'));
      // Patches for shared schemas (item descriptor, block reference, …) keyed by their path under `source/`.
      const rel = path.relative(path.join(schemasRoot, 'source'), file).split(path.sep).join('/');
      const patchFile =
        sharedPatchesDir && path.join(sharedPatchesDir, rel);
      if (patchFile && existsSync(patchFile)) {
        doc = mergePatch(doc, JSON.parse(readFileSync(patchFile, 'utf8')));
      }
      // One patch or a list (applied in order, e.g. official-derived first, hand-written last).
      for (const entry of [filePatches.get(file) ?? []].flat()) {
        const { $stripKeys: strip = [], ...patch } = entry;
        doc = mergePatch(strip.length ? stripKeysDeep(doc, strip) : doc, patch);
      }
      files.set(file, doc);
    }

    return files.get(file);
  };
  // Patches are merged into the raw source file, so `$ref`s in them resolve like the original ones.
  const filePatches = new Map();
  const addPatch = (file, patch) => {
    filePatches.set(file, patch);
    files.delete(file);
  };

  const pointer = (doc, ptr) =>
    ptr
      .replace(/^#?\/?/, '')
      .split('/')
      .filter(Boolean)
      .reduce((node, key) => node?.[decodeURIComponent(key)], doc);

  /**
   * @param node schema node found in `file`
   * @param stack `file#ptr` keys being resolved (cycle guard)
   */
  const resolveNode = (node, file, stack) => {
    if (Array.isArray(node)) {
      return node.map((item) => resolveNode(item, file, stack));
    }
    if (node === null || typeof node !== 'object') {
      return node;
    }

    if (typeof node.$ref === 'string') {
      const [refFile, ptr = ''] = node.$ref.split('#');
      const targetFile = refFile
        ? path.resolve(path.dirname(file), refFile)
        : file;
      const normalized = targetFile.replace(/\\/g, '/');
      const shared = SHARED.find(([suffix]) => normalized.endsWith(suffix));
      if (shared !== undefined && ptr === '') {
        return { 'x-shared': shared[1], ...docOf(node) };
      }
      const key = `${targetFile}#${ptr}`;
      if (stack.includes(key)) {
        return { 'x-recursive': true, ...docOf(node) };
      }
      const doc = readSchema(targetFile);
      const target = ptr ? pointer(doc, ptr) : doc;
      if (target === undefined) {
        return { 'x-unresolved': node.$ref };
      }
      const resolved = resolveNode(target, targetFile, [...stack, key]);
      const siblings = Object.fromEntries(
        Object.entries(node).filter(([k]) => k !== '$ref'),
      );
      // A sibling `type` that disagrees with the referenced definition is an upstream mistake.
      if (
        resolved.type !== undefined ||
        resolved.oneOf !== undefined ||
        resolved.anyOf !== undefined ||
        resolved['x-shared'] !== undefined
      ) {
        delete siblings.type;
      }

      return { ...resolved, ...resolveNode(siblings, file, stack) };
    }

    const out = {};
    for (const [key, value] of Object.entries(node)) {
      if (key === 'definitions' || key === '$defs') {
        continue;
      }
      out[key] = resolveNode(value, file, stack);
    }

    return out;
  };

  return { readSchema, addPatch, resolve: (file) => resolveNode(readSchema(file), file, [file]) };
};

const docOf = (node) =>
  Object.fromEntries(
    Object.entries(node).filter(([k]) => k === 'description' || k.startsWith('x-')),
  );

/** Extension `$stripKeys`: removes keywords (e.g. an upstream `pattern` that rejects vanilla) everywhere in a file. */
const stripKeysDeep = (node, keys) => {
  if (Array.isArray(node)) {
    return node.map((item) => stripKeysDeep(item, keys));
  }
  if (node === null || typeof node !== 'object') {
    return node;
  }

  return Object.fromEntries(
    Object.entries(node)
      .filter(([key, value]) => !(keys.includes(key) && typeof value !== 'object'))
      .map(([key, value]) => [key, stripKeysDeep(value, keys)]),
  );
};

/** Applies an RFC 7396 JSON merge patch. */
export const mergePatch = (target, patch) => {
  if (patch === null || typeof patch !== 'object' || Array.isArray(patch)) {
    return patch;
  }
  // Extension: `{ "$append": [...] }` appends to an existing array (e.g. a new oneOf branch).
  if (Array.isArray(patch.$append)) {
    return [...(Array.isArray(target) ? target : []), ...patch.$append];
  }
  const out =
    target !== null && typeof target === 'object' && !Array.isArray(target)
      ? { ...target }
      : {};
  for (const [key, value] of Object.entries(patch)) {
    if (value === null) {
      delete out[key];
    } else {
      out[key] = mergePatch(out[key], value);
    }
  }

  return out;
};

/** Drops documentation-only keywords (used for the validation schema). */
export const stripDocs = (node) => {
  if (Array.isArray(node)) {
    return node.map(stripDocs);
  }
  if (node === null || typeof node !== 'object') {
    return node;
  }

  return Object.fromEntries(
    Object.entries(node)
      .filter(([key]) => !DOC_KEYS.has(key) && !['description', 'default', 'format'].includes(key))
      .map(([key, value]) => [
        key,
        key === 'properties' || key === 'patternProperties'
          ? Object.fromEntries(
              Object.entries(value).map(([k, v]) => [k, stripDocs(v)]),
            )
          : stripDocs(value),
      ]),
  );
};

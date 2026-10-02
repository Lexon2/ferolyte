import { readdir, readFile, stat } from 'fs/promises';
import { join, relative, sep } from 'path';

import { BUILD_CONTEXT } from '../build-context';
import { parseJsonc } from '../utils/read-jsonc';

export type DocumentKind =
  | 'server-entity'
  | 'client-entity'
  | 'attachable'
  | 'render-controller'
  | 'recipe'
  | 'spawn-rule'
  | 'item'
  | 'block'
  | 'animation-controller-bp'
  | 'animation-controller-rp';

/** A built content JSON (from `.ts` content or a plain JSON file of the packs). */
export interface ProjectDocument {
  source: string;
  kind: DocumentKind;
  json: any;
}

export interface EntityInfo {
  id: string;
  source: string;
  events: Set<string>;
  componentGroups: Set<string>;
  properties: Set<string>;
  json: any;
}

export interface RegistryIndex {
  animations: Set<string>;
  /** Derived ids written by the compiler (animation options), not part of the ids file. */
  generatedAnimations: Set<string>;
  animationControllers: Set<string>;
  geometries: Set<string>;
  renderControllers: Set<string>;
  itemTextures: Set<string>;
  terrainTextures: Set<string>;
  sounds: Set<string>;
  particles: Set<string>;
  bpAnimations: Set<string>;
  bpAnimationControllers: Set<string>;
  entities: Map<string, EntityInfo>;
  items: Set<string>;
  blocks: Map<string, { states: Set<string> }>;
  lootTables: Set<string>;
  tradeTables: Set<string>;
  functions: Set<string>;
  documents: ProjectDocument[];
}

type ResourceKind =
  | 'animations'
  | 'animationControllers'
  | 'geometries'
  | 'renderControllers'
  | 'itemTextures'
  | 'terrainTextures'
  | 'sounds'
  | 'particles'
  | 'bpAnimations'
  | 'bpAnimationControllers'
  | 'lootTables'
  | 'tradeTables'
  | 'functions';

type ResourceEntry =
  | { mtimeMs: number; file: string; type: 'ids'; kind: ResourceKind; ids: string[] }
  | { mtimeMs: number; file: string; type: 'document'; kind: DocumentKind; json: any };

const built = new Map<string, ProjectDocument[]>();
const pending = new Map<string, { documents: ProjectDocument[]; animations: string[] }>();
const generatedBySource = new Map<string, string[]>();
const resources = new Map<string, ResourceEntry>();
let strictReferences = false;

/** With `--strict`, reference problems are errors instead of warnings. */
export const setStrictReferences = (strict: boolean): void => {
  strictReferences = strict;
};

export const isStrictReferences = (): boolean => strictReferences;

export const clearRegistry = (): void => {
  built.clear();
  pending.clear();
  generatedBySource.clear();
  resources.clear();
};

/**
 * Collecting of the documents of one source file. Like the lang registry, the
 * previous documents stay active until `commitSourceDocuments`.
 */
export const beginSourceDocuments = (source: string): void => {
  pending.set(source, { documents: [], animations: [] });
};

export const registerContentJson = (
  source: string,
  kind: DocumentKind,
  json: unknown,
  generated?: { animations?: string[] },
): void => {
  const entry = pending.get(source);
  if (!entry) {
    return;
  }
  entry.documents.push({ source, kind, json });
  entry.animations.push(...(generated?.animations ?? []));
};

export const commitSourceDocuments = (source: string): void => {
  const entry = pending.get(source);
  pending.delete(source);
  if (!entry) {
    return;
  }
  built.set(source, entry.documents);
  generatedBySource.set(source, entry.animations);
};

export const removeSourceDocuments = (source: string): void => {
  pending.delete(source);
  built.delete(source);
  generatedBySource.delete(source);
};

const readJson = async (file: string): Promise<any | undefined> => {
  const parsed = parseJsonc(await readFile(file, 'utf-8'));

  return parsed.ok ? parsed.value : undefined;
};

const keysOf = (value: unknown): string[] =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? Object.keys(value)
    : [];

/** Geometry ids of a `.geo.json` (1.12 keys `geometry.x[:parent]` and 1.16+ descriptions). */
const geometryIds = (json: any): string[] => {
  const ids: string[] = [];
  if (Array.isArray(json?.['minecraft:geometry'])) {
    for (const geometry of json['minecraft:geometry']) {
      const id = geometry?.description?.identifier;
      if (typeof id === 'string') {
        ids.push(id);
      }
    }
  }
  for (const key of keysOf(json)) {
    if (key.startsWith('geometry.')) {
      ids.push(key.split(':')[0]);
    }
  }

  return ids;
};

const textureKeys = (json: any): string[] => keysOf(json?.texture_data);

const soundIds = (json: any): string[] =>
  keysOf(json?.sound_definitions ?? json);

interface Rule {
  pack: 'RP' | 'BP';
  dir: string;
  ext: string;
  /** Exact relative file (e.g. `textures/item_texture.json`) instead of a directory walk. */
  file?: string;
  entry: (json: any, relativePath: string) => ResourceEntryResult | undefined;
}

type ResourceEntryResult =
  | { type: 'ids'; kind: ResourceKind; ids: string[] }
  | { type: 'document'; kind: DocumentKind };

const RULES: Rule[] = [
  { pack: 'RP', dir: 'animations', ext: '.json', entry: (j) => ({ type: 'ids', kind: 'animations', ids: keysOf(j?.animations) }) },
  { pack: 'RP', dir: 'animation_controllers', ext: '.json', entry: (j) => ({ type: 'ids', kind: 'animationControllers', ids: keysOf(j?.animation_controllers) }) },
  { pack: 'RP', dir: 'models', ext: '.json', entry: (j) => ({ type: 'ids', kind: 'geometries', ids: geometryIds(j) }) },
  { pack: 'RP', dir: 'render_controllers', ext: '.json', entry: (j) => ({ type: 'ids', kind: 'renderControllers', ids: keysOf(j?.render_controllers) }) },
  { pack: 'RP', dir: 'textures', ext: '.json', file: 'textures/item_texture.json', entry: (j) => ({ type: 'ids', kind: 'itemTextures', ids: textureKeys(j) }) },
  { pack: 'RP', dir: 'textures', ext: '.json', file: 'textures/terrain_texture.json', entry: (j) => ({ type: 'ids', kind: 'terrainTextures', ids: textureKeys(j) }) },
  { pack: 'RP', dir: 'sounds', ext: '.json', file: 'sounds/sound_definitions.json', entry: (j) => ({ type: 'ids', kind: 'sounds', ids: soundIds(j) }) },
  { pack: 'RP', dir: 'particles', ext: '.json', entry: (j) => {
    const id = j?.particle_effect?.description?.identifier;

    return { type: 'ids', kind: 'particles', ids: typeof id === 'string' ? [id] : [] };
  } },
  { pack: 'RP', dir: 'entity', ext: '.json', entry: () => ({ type: 'document', kind: 'client-entity' }) },
  { pack: 'RP', dir: 'attachables', ext: '.json', entry: () => ({ type: 'document', kind: 'attachable' }) },
  { pack: 'BP', dir: 'recipes', ext: '.json', entry: () => ({ type: 'document', kind: 'recipe' }) },
  { pack: 'BP', dir: 'spawn_rules', ext: '.json', entry: () => ({ type: 'document', kind: 'spawn-rule' }) },
  { pack: 'BP', dir: 'entities', ext: '.json', entry: () => ({ type: 'document', kind: 'server-entity' }) },
  { pack: 'BP', dir: 'items', ext: '.json', entry: () => ({ type: 'document', kind: 'item' }) },
  { pack: 'BP', dir: 'blocks', ext: '.json', entry: () => ({ type: 'document', kind: 'block' }) },
  { pack: 'BP', dir: 'animations', ext: '.json', entry: (j) => ({ type: 'ids', kind: 'bpAnimations', ids: keysOf(j?.animations) }) },
  { pack: 'BP', dir: 'animation_controllers', ext: '.json', entry: (j) => ({ type: 'ids', kind: 'bpAnimationControllers', ids: keysOf(j?.animation_controllers) }) },
  { pack: 'BP', dir: 'loot_tables', ext: '.json', entry: (_, rel) => ({ type: 'ids', kind: 'lootTables', ids: [rel] }) },
  { pack: 'BP', dir: 'trading', ext: '.json', entry: (_, rel) => ({ type: 'ids', kind: 'tradeTables', ids: [rel] }) },
  { pack: 'BP', dir: 'trade_tables', ext: '.json', entry: (_, rel) => ({ type: 'ids', kind: 'tradeTables', ids: [rel] }) },
  { pack: 'BP', dir: 'functions', ext: '.mcfunction', entry: (_, rel) => ({ type: 'ids', kind: 'functions', ids: [rel] }) },
];

const walk = async (dir: string, ext: string): Promise<string[]> => {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files: string[] = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules') {
        files.push(...(await walk(path, ext)));
      }
    } else if (entry.name.endsWith(ext)) {
      files.push(path);
    }
  }

  return files;
};

/**
 * Re-reads only the pack files whose modification time changed.
 * @returns `true` when anything was added, changed or removed.
 */
export const scanResources = async (): Promise<boolean> => {
  const roots = {
    RP: BUILD_CONTEXT.PACKS.INPUT_RESOURCE_PACK_PATH,
    BP: BUILD_CONTEXT.PACKS.INPUT_BEHAVIOR_PACK_PATH,
  };
  const seen = new Set<string>();
  let changed = false;

  for (const rule of RULES) {
    const root = roots[rule.pack];
    const files = rule.file
      ? [join(root, rule.file)]
      : await walk(join(root, rule.dir), rule.ext);

    for (const file of files) {
      let mtimeMs: number;
      try {
        mtimeMs = (await stat(file)).mtimeMs;
      } catch {
        continue;
      }
      const key = `${rule.pack}:${rule.file ?? ''}:${rule.dir}:${file}`;
      seen.add(key);
      if (resources.get(key)?.mtimeMs === mtimeMs) {
        continue;
      }

      changed = true;
      const rel = relative(root, file).split(sep).join('/');
      const json = rule.ext === '.json' ? await readJson(file) : undefined;
      const result = rule.entry(json, rel);
      if (!result || (rule.ext === '.json' && json === undefined)) {
        resources.delete(key);
        continue;
      }
      resources.set(
        key,
        result.type === 'ids'
          ? { mtimeMs, file, type: 'ids', kind: result.kind, ids: result.ids }
          : { mtimeMs, file, type: 'document', kind: result.kind, json },
      );
    }
  }

  for (const key of [...resources.keys()]) {
    if (!seen.has(key)) {
      resources.delete(key);
      changed = true;
    }
  }

  return changed;
};

const idOf = (document: ProjectDocument): string | undefined => {
  const root =
    document.json?.['minecraft:entity'] ??
    document.json?.['minecraft:client_entity'] ??
    document.json?.['minecraft:item'] ??
    document.json?.['minecraft:block'];
  const id = root?.description?.identifier;

  return typeof id === 'string' ? id : undefined;
};

/** Builds the lookup sets from built content plus scanned pack files. */
export const buildIndex = (): RegistryIndex => {
  const index: RegistryIndex = {
    animations: new Set(),
    generatedAnimations: new Set(),
    animationControllers: new Set(),
    geometries: new Set(),
    renderControllers: new Set(),
    itemTextures: new Set(),
    terrainTextures: new Set(),
    sounds: new Set(),
    particles: new Set(),
    bpAnimations: new Set(),
    bpAnimationControllers: new Set(),
    entities: new Map(),
    items: new Set(),
    blocks: new Map(),
    lootTables: new Set(),
    tradeTables: new Set(),
    functions: new Set(),
    documents: [],
  };

  for (const entry of resources.values()) {
    if (entry.type === 'ids') {
      entry.ids.forEach((id) => index[entry.kind].add(id));
    } else {
      index.documents.push({ source: entry.file, kind: entry.kind, json: entry.json });
    }
  }
  for (const documents of built.values()) {
    index.documents.push(...documents);
  }
  for (const animations of generatedBySource.values()) {
    animations.forEach((id) => index.generatedAnimations.add(id));
  }

  for (const document of index.documents) {
    const id = idOf(document);
    if (document.kind === 'server-entity' && id) {
      const root = document.json['minecraft:entity'];
      index.entities.set(id, {
        id,
        source: document.source,
        events: new Set(keysOf(root.events)),
        componentGroups: new Set(keysOf(root.component_groups)),
        properties: new Set(keysOf(root.description?.properties)),
        json: document.json,
      });
    } else if (document.kind === 'item' && id) {
      index.items.add(id);
    } else if (document.kind === 'block' && id) {
      index.blocks.set(id, {
        states: new Set(keysOf(document.json['minecraft:block'].description?.states)),
      });
    } else if (document.kind === 'animation-controller-rp') {
      keysOf(document.json?.animation_controllers).forEach((key) =>
        index.animationControllers.add(key),
      );
    } else if (document.kind === 'animation-controller-bp') {
      keysOf(document.json?.animation_controllers).forEach((key) =>
        index.bpAnimationControllers.add(key),
      );
    }
  }

  return index;
};

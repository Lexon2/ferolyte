// Schema-driven codegen (G1 entities + filters, G2 items + blocks).
//   .cache/bedrock-schemas (pinned) + scripts/schemas/patches  →  packages/pack/content/generated/<area>/
//     <kind>.ts      TS interfaces (camelCase, JSDoc, @minecraft)
//     key-maps.ts    exact camelCase → snake_case maps per component
//     validators.ts  ajv standalone validators (no schema compilation at user build time)
//     registry.ts    key → { key, map, validate }
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { emitArea } from './codegen/area.mjs';
import { snakeToCamel } from './codegen/emit.mjs';
import { createLoader } from './codegen/schema-tree.mjs';

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);
const SCHEMAS = path.join(ROOT, '.cache/bedrock-schemas');
const SOURCE = path.join(SCHEMAS, 'source/behavior');
const PATCHES = path.join(ROOT, 'scripts/schemas/patches');
// `CODEGEN_OUT` redirects the output (used by `npm run codegen:check`).
const OUT =
  process.env.CODEGEN_OUT ?? path.join(ROOT, 'packages/pack/content/generated');

if (!existsSync(SOURCE)) {
  console.error('Schemas missing: run `node scripts/schemas/fetch.mjs` first');
  process.exit(1);
}

// Patches derived from the official Mojang schemas (scripts/schemas/generate-official-patches.mjs).
// `CODEGEN_NO_OFFICIAL=1` skips them (the baseline the official patches are computed against).
const OFFICIAL_PATCHES = process.env.CODEGEN_NO_OFFICIAL
  ? path.join(PATCHES, 'official-disabled')
  : path.join(PATCHES, 'official');

import { mergePatch } from './codegen/schema-tree.mjs';

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));
const readSdkNames = (area) => {
  const file = path.join(PATCHES, area, 'sdk-names.json');

  return existsSync(file) ? readJson(file) : {};
};

const mechanicalKey = (key) =>
  snakeToCamel(
    key
      .replace(/^minecraft:behavior\./, '')
      .replace(/^minecraft:/, '')
      .replace(/\.([a-z])/g, '_$1'),
  );

/** Adds components that Blockception lacks entirely (new Minecraft releases): patch files with `x-new-component`. */
// `CODEGEN_EXTRA_PATCHES` adds a second patch root for new components (used by the generator tests).
const EXTRA_PATCHES = process.env.CODEGEN_EXTRA_PATCHES;

const addNewComponents = (entries, area, patchDirs, sdkNames) => {
  const roots = [PATCHES, OFFICIAL_PATCHES, ...(EXTRA_PATCHES ? [EXTRA_PATCHES] : [])];
  for (const [dirName, kind] of patchDirs)
    for (const root of roots) {
      const dir = path.join(root, area, dirName);
      if (!existsSync(dir)) continue;
      for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
        const patch = readJson(path.join(dir, file));
        const key = patch['x-new-component'];
        if (
          key === undefined ||
          entries.some((e) => e.key === key && e.kind === kind)
        )
          continue;
        const { 'x-new-component': _, ...tree } = patch;
        entries.push({
          key,
          kind,
          sdkKey: sdkNames[key] ?? mechanicalKey(key),
          tree,
        });
      }
    }
};

/** Collects `{ key → $ref }` entries of an index schema, resolving each (with patches). */
const collect = ({
  loader,
  area,
  props,
  baseDir,
  kindOf,
  patchDir,
  sdkNames,
}) => {
  const entries = [];
  for (const [key, ref] of Object.entries(props)) {
    const rel = ref.$ref.replace(/^\.\//, '');
    const file = path.join(baseDir, rel);
    const base = path.basename(rel, '.json');
    const patchFile = path.join(PATCHES, area, patchDir(rel), `${base}.json`);
    const officialFile = path.join(OFFICIAL_PATCHES, area, patchDir(rel), `${base}.json`);
    // Official-derived patch first, the hand-written one wins.
    const patch = [officialFile, patchFile]
      .filter((f) => existsSync(f))
      .map(readJson);
    if (patch.length > 0) {
      loader.addPatch(file, patch);
    }
    entries.push({
      key,
      kind: kindOf(key, rel),
      sdkKey: sdkNames[key] ?? mechanicalKey(key),
      tree: loader.resolve(file),
    });
  }

  return entries;
};

const sorted = (entries) =>
  entries.sort((a, b) => a.sdkKey.localeCompare(b.sdkKey));
const loaderFor = () => createLoader(SCHEMAS, path.join(PATCHES, 'shared'));
const report = [];

// ------------------------------------------------------------------ entity
{
  const base = path.join(SOURCE, 'entities/format');
  const loader = loaderFor();
  const sdkNames = readSdkNames('entity');
  const index = loader.readSchema(path.join(base, 'components.json'));
  const entries = collect({
    loader,
    area: 'entity',
    props: index.properties,
    baseDir: base,
    kindOf: (key) =>
      key.startsWith('minecraft:behavior.') ? 'behavior' : 'component',
    patchDir: (rel) =>
      rel.startsWith('behaviors/') ? 'behaviors' : 'components',
    sdkNames,
  });
  addNewComponents(
    entries,
    'entity',
    [
      ['components', 'component'],
      ['behaviors', 'behavior'],
    ],
    sdkNames,
  );
  report.push([
    'entity',
    emitArea({
      id: 'entity',
      outDir: path.join(OUT, 'entity'),
      entries: sorted(entries),
      kinds: {
        component: {
          file: 'components',
          aggregate: 'GeneratedEntityComponents',
          suffix: 'Component',
          registry: 'entityComponentRegistry',
        },
        behavior: {
          file: 'behaviors',
          aggregate: 'GeneratedEntityBehaviors',
          suffix: 'Behavior',
          registry: 'entityBehaviorRegistry',
        },
      },
    }),
  ]);
}

// ----------------------------------------------------------------- filters
{
  const dir = path.join(SOURCE, 'entities/filters/filters');
  const loader = loaderFor();
  const entries = [];
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const test = path.basename(file, '.json');
    const patchFile = path.join(PATCHES, 'filters', `${test}.json`);
    if (existsSync(patchFile)) {
      loader.addPatch(path.join(dir, file), readJson(patchFile));
    }
    entries.push({
      key: test,
      kind: 'filter',
      sdkKey: test,
      tree: loader.resolve(path.join(dir, file)),
    });
  }
  addNewComponents(
    entries,
    'filters',
    [['.', 'filter']],
    new Proxy({}, { get: (_, key) => key }),
  );
  report.push([
    'filters',
    emitArea({
      id: 'filters',
      outDir: path.join(OUT, 'filters'),
      entries: sorted(entries),
      kinds: {
        filter: {
          file: 'filters',
          aggregate: 'GeneratedFilters',
          suffix: 'Filter',
          registry: 'filterRegistry',
        },
      },
    }),
  ]);
}

// -------------------------------------------------------------------- item
{
  const base = path.join(SOURCE, 'items/format');
  const loader = loaderFor();
  const sdkNames = readSdkNames('item');
  const index = loader.readSchema(path.join(base, 'minecraft.item.json'));
  const entries = collect({
    loader,
    area: 'item',
    props: index.properties.components.properties,
    baseDir: base,
    kindOf: () => 'component',
    patchDir: () => 'components',
    sdkNames,
  });
  addNewComponents(entries, 'item', [['components', 'component']], sdkNames);
  report.push([
    'item',
    emitArea({
      id: 'item',
      outDir: path.join(OUT, 'item'),
      entries: sorted(entries),
      kinds: {
        component: {
          file: 'components',
          aggregate: 'GeneratedItemComponents',
          suffix: 'Component',
          registry: 'itemComponentRegistry',
        },
      },
    }),
  ]);
}

// ------------------------------------------------------------------- block
{
  const base = path.join(SOURCE, 'blocks/format');
  const loader = loaderFor();
  const sdkNames = readSdkNames('block');
  const index = loader.readSchema(path.join(base, 'minecraft.block.json'));
  const entries = [
    ...collect({
      loader,
      area: 'block',
      props: index.definitions.components_ref.properties,
      baseDir: base,
      kindOf: () => 'component',
      patchDir: () => 'components',
      sdkNames,
    }),
    ...collect({
      loader,
      area: 'block',
      props: index.definitions.traits_ref.properties,
      baseDir: base,
      kindOf: () => 'trait',
      patchDir: () => 'traits',
      sdkNames,
    }),
  ];
  addNewComponents(
    entries,
    'block',
    [
      ['components', 'component'],
      ['traits', 'trait'],
    ],
    sdkNames,
  );
  report.push([
    'block',
    emitArea({
      id: 'block',
      outDir: path.join(OUT, 'block'),
      entries: sorted(entries),
      kinds: {
        component: {
          file: 'components',
          aggregate: 'GeneratedBlockComponents',
          suffix: 'Component',
          registry: 'blockComponentRegistry',
        },
        trait: {
          file: 'traits',
          aggregate: 'GeneratedBlockTraits',
          suffix: 'Trait',
          registry: 'blockTraitRegistry',
        },
      },
    }),
  ]);
}

for (const [area, counts] of report) {
  console.log(`codegen ${area}: ${JSON.stringify(counts)}`);
}

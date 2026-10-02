// Compares the generated SDK (Blockception schemas + patches) with the official Mojang JSON schemas
// (`Mojang/bedrock-samples/metadata/json_schemas`, fetched by fetch-samples.mjs).
//   node scripts/schemas/compare-official.mjs [--version 1.26.50]
// Writes docs/roadmap/official-schemas-report.md:
//   - components the SDK has but the official index lacks   → `x-removed` candidates (or never existed)
//   - components the official index has but the SDK lacks    → missing components
//   - field level: properties of the official schema missing in the SDK key map, and vice versa
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OFFICIAL = path.join(ROOT, '.cache/bedrock-samples/metadata/json_schemas/server');
const GENERATED = path.join(ROOT, 'packages/pack/content/generated');
const REPORT = path.join(ROOT, 'docs/roadmap/official-schemas-report.md');
const versionArg = process.argv.indexOf('--version');
const VERSION = versionArg > 0 ? process.argv[versionArg + 1] : '1.26.50';

if (!existsSync(OFFICIAL)) {
  console.error('Official schemas missing: run `node scripts/schemas/fetch-samples.mjs` first');
  process.exit(1);
}

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));

/** Component key → official schema file (resolved through the `$ref` of the version index). */
const officialIndex = (indexFile) => {
  const index = readJson(indexFile);
  const out = new Map();
  for (const [key, value] of Object.entries(index.properties ?? {})) {
    out.set(
      key,
      value.$ref ? path.resolve(path.dirname(indexFile), decodeURIComponent(value.$ref)) : undefined,
    );
  }

  return out;
};

const officialProps = (file) => {
  if (file === undefined || !existsSync(file)) return undefined;
  const schema = readJson(file);
  const parts = [schema, ...(schema.allOf ?? []), ...(schema.oneOf ?? []), ...(schema.anyOf ?? [])];

  return new Set(parts.flatMap((part) => Object.keys(part.properties ?? {})));
};

const areas = [
  {
    name: 'entity',
    index: path.join(OFFICIAL, 'entity', VERSION, 'Entity component definitions.json'),
    generated: ['entity/registry.ts', 'entity/key-maps.ts'],
  },
  {
    name: 'item',
    index: path.join(OFFICIAL, 'item', '1.26.30', 'Item Components.json'),
    generated: ['item/registry.ts', 'item/key-maps.ts'],
  },
  {
    name: 'block',
    index: path.join(OFFICIAL, 'block', '1.26.20', 'Components.json'),
    generated: ['block/registry.ts', 'block/key-maps.ts'],
  },
];

/** `{ key, kind, sdkKey }` from registry.ts and the key maps (JSON literal) from key-maps.ts. */
const readGenerated = ([registryFile, mapFile]) => {
  const registry = readFileSync(path.join(GENERATED, registryFile), 'utf8');
  const entries = [...registry.matchAll(/entry\('([^']+)', '([^']+)', '(\w+)'/g)].map((m) => ({
    key: m[1],
    sdkKey: m[2],
    kind: m[3],
  }));
  const maps = readFileSync(path.join(GENERATED, mapFile), 'utf8');
  const keyMaps = JSON.parse(maps.slice(maps.indexOf('= {') + 2, maps.lastIndexOf('};') + 1));

  return { entries, keyMaps };
};

const lines = ['# Official Mojang schemas vs generated SDK', ''];
lines.push(`Official source: \`Mojang/bedrock-samples\` \`metadata/json_schemas/server\` (entity index ${VERSION}, item 1.26.30, block 1.26.20).`, '');
const summary = [];

for (const area of areas) {
  const official = officialIndex(area.index);
  const { entries, keyMaps } = readGenerated(area.generated);
  const sdk = entries.filter((e) => e.kind === 'component' || e.kind === 'behavior');
  const officialKeys = new Set(official.keys());
  const sdkKeys = new Set(sdk.map((e) => e.key));

  const onlySdk = sdk.filter((e) => !officialKeys.has(e.key));
  const onlyOfficial = [...officialKeys].filter((key) => !sdkKeys.has(key));
  lines.push(`## ${area.name}`, '', `SDK ${sdk.length} · official ${officialKeys.size} · only SDK ${onlySdk.length} · only official ${onlyOfficial.length}`, '');
  lines.push('### In the SDK but not in the official index (`x-removed` candidates)', '');
  lines.push(onlySdk.length ? onlySdk.map((e) => `- \`${e.key}\``).join('\n') : '_none_', '');
  lines.push('### In the official index but not in the SDK', '');
  lines.push(onlyOfficial.length ? onlyOfficial.map((k) => `- \`${k}\``).join('\n') : '_none_', '');

  const fieldDiffs = [];
  for (const entry of sdk) {
    if (!officialKeys.has(entry.key)) continue;
    const props = officialProps(official.get(entry.key));
    const map = keyMaps[`${entry.kind}:${entry.sdkKey}`];
    if (props === undefined || props.size === 0 || map === undefined) continue;
    const sdkProps = new Set(Object.values(map.p ?? {}).map(([snake]) => snake));
    const missing = [...props].filter((p) => !sdkProps.has(p));
    const extra = [...sdkProps].filter((p) => !props.has(p));
    if (missing.length || extra.length) {
      fieldDiffs.push({ key: entry.key, missing, extra });
    }
  }
  lines.push(`### Field differences (${fieldDiffs.length} components)`, '');
  for (const d of fieldDiffs) {
    lines.push(
      `- \`${d.key}\`${d.missing.length ? ` · official only: ${d.missing.join(', ')}` : ''}${d.extra.length ? ` · SDK only: ${d.extra.join(', ')}` : ''}`,
    );
  }
  lines.push('');
  summary.push(`${area.name}: only SDK ${onlySdk.length}, only official ${onlyOfficial.length}, field diffs ${fieldDiffs.length}`);
}

writeFileSync(REPORT, `${lines.join('\n')}\n`);
console.log(summary.join('\n'));
console.log(`report: ${path.relative(ROOT, REPORT)}`);

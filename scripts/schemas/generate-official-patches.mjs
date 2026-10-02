// Turns the classified official-vs-SDK differences into patches (scripts/schemas/patches/official/**).
//   node scripts/schemas/generate-official-patches.mjs
// Generated (and committed) so the codegen needs no official data; re-run after bumping the pinned samples:
//   - official-only components   → new component (typed from the official body, or x-free-form without a body)
//   - official-only fields       → property added from the official body, `x-since` when it appeared after the first official version
//   - SDK-only fields            → `x-removed` (official history proves the drop) or `x-deprecated` (no proof)
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parse } from 'jsonc-parser';

import { classify } from './classify-official.mjs';
import { fieldHistory, officialIndex, officialVersions, resolveInline, resolveNode } from './official.mjs';
import { fieldUsage, loadCorpus } from './removal-evidence.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = path.join(ROOT, 'scripts/schemas/patches/official');
const SOURCE = path.join(ROOT, '.cache/bedrock-schemas/source/behavior');

const readJsonc = (file) => parse(readFileSync(file, 'utf8'));

/** component key → { dir: 'components' | 'behaviors' | 'traits', base: file name without .json } in the Blockception tree. */
const blockceptionFiles = () => {
  const out = { entity: new Map(), item: new Map(), block: new Map() };
  const entity = readJsonc(path.join(SOURCE, 'entities/format/components.json'));
  for (const [key, ref] of Object.entries(entity.properties)) {
    const rel = ref.$ref.replace(/^\.\//, '');
    out.entity.set(key, { dir: rel.startsWith('behaviors/') ? 'behaviors' : 'components', base: path.basename(rel, '.json') });
  }
  const item = readJsonc(path.join(SOURCE, 'items/format/minecraft.item.json'));
  for (const [key, ref] of Object.entries(item.properties.components.properties)) {
    out.item.set(key, { dir: 'components', base: path.basename(ref.$ref, '.json') });
  }
  const block = readJsonc(path.join(SOURCE, 'blocks/format/minecraft.block.json'));
  for (const [key, ref] of Object.entries(block.definitions.components_ref.properties)) {
    out.block.set(key, { dir: 'components', base: path.basename(ref.$ref, '.json') });
  }

  return out;
};

const write = (rel, data) => {
  const file = path.join(OUT, rel);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
};

rmSync(OUT, { recursive: true, force: true });
// Differences are computed against a generation WITHOUT the official patches, so re-runs are stable.
const baseline = mkdtempSync(path.join(tmpdir(), 'ferolyte-official-baseline-'));
execFileSync('node', ['scripts/schemas/codegen.mjs'], {
  cwd: ROOT,
  stdio: 'ignore',
  env: { ...process.env, CODEGEN_OUT: baseline, CODEGEN_NO_OFFICIAL: '1' },
});
const diffs = classify(baseline);
rmSync(baseline, { recursive: true, force: true });
const files = blockceptionFiles();
const corpus = loadCorpus();
const patches = new Map(); // `${area}/${dir}/${base}` → patch
const summary = { components: 0, fields: 0, removed: 0, deprecated: 0 };

const patchFor = (area, key) => {
  const f = files[area].get(key);
  if (f === undefined) return undefined;
  const id = `${area}/${f.dir}/${f.base}`;
  if (!patches.has(id)) patches.set(id, { properties: {} });

  return patches.get(id);
};

for (const d of diffs) {
  const versions = officialVersions(d.area);
  const latest = versions.at(-1);

  // ---- official-only components
  if (!d.field && d.side === 'official-only') {
    const file = officialIndex(d.area, latest).get(d.component);
    const name = d.component.replace(/^minecraft:/, '');
    const dir = d.component.startsWith('minecraft:behavior.') ? 'behaviors' : 'components';
    const base = {
      'x-new-component': d.component,
      'x-official': d.official,
    };
    if (file === undefined) {
      write(`${d.area}/${dir}/${name}.json`, {
        ...base,
        type: 'object',
        description: 'Listed by the official Mojang schemas without a body.',
        additionalProperties: {},
        'x-free-form': 'the official Mojang schema lists the component without a body ("Dynamic value")',
      });
    } else {
      const tree = resolveInline(file);
      const empty = !tree.properties && !tree.oneOf && !tree.anyOf && !tree.allOf;
      write(
        `${d.area}/${dir}/${name}.json`,
        empty
          ? { ...base, ...tree, additionalProperties: {}, 'x-free-form': 'the official Mojang schema has a body without properties' }
          : { ...base, ...tree },
      );
    }
    summary.components++;
    continue;
  }

  if (!d.field) continue;
  const patch = patchFor(d.area, d.component);
  if (patch === undefined) continue;

  // ---- official-only fields
  if (d.side === 'official-only' && d.classification === 'real') {
    const file = officialIndex(d.area, latest).get(d.component);
    const schema = JSON.parse(readFileSync(file, 'utf8'));
    const parts = [schema, ...(schema.allOf ?? []), ...(schema.oneOf ?? []), ...(schema.anyOf ?? [])];
    const body = parts.map((p) => p.properties?.[d.field]).find(Boolean);
    const resolved = resolveNode(body, file);
    const gated = d.officialVersions?.[0] !== versions[0] ? d.officialVersions[0] : undefined;
    patch.properties[d.field] = { ...resolved, ...(gated ? { 'x-since': gated } : {}) };
    summary.fields++;
    continue;
  }

  // ---- SDK-only fields
  if (d.side === 'sdk-only') {
    const usage = d.vanilla && Object.keys(d.vanilla).length ? ` Vanilla corpus uses it in ${Object.entries(d.vanilla).map(([v, n]) => `${v}: ${n}`).join(', ')}.` : '';
    if (d.classification === 'removed') {
      const { history } = fieldHistory(d.area, d.component);
      const had = history.get(d.field);
      const last = had.at(-1);
      const since = versions[versions.indexOf(last) + 1];
      if (since === undefined) continue;
      const replacement = { attack_radius: ['attackRange'], attack_radius_min: ['attackRange'] }[d.field];
      patch.properties[d.field] = {
        'x-removed': {
          since,
          ...(replacement ? { replacement } : {}),
          reason: `the official schema of ${d.component} has it in ${had[0]}–${last} and drops it from ${since}.${usage}`,
        },
        'x-evidence': { method: 'official per-version schemas (metadata/json_schemas)', component: d.component, field: d.field, officialVersions: had, vanillaUsage: d.vanilla },
      };
      summary.removed++;
    } else {
      patch.properties[d.field] = {
        'x-deprecated': {
          reason: `not in the official Mojang schemas (${versions[0]}–${latest}); no proof that the game rejects it.${usage}`,
        },
      };
      summary.deprecated++;
    }
  }
}

for (const [id, patch] of patches) {
  if (Object.keys(patch.properties).length > 0) write(`${id}.json`, patch);
}
console.log(`official patches written to ${path.relative(ROOT, OUT)}: ${JSON.stringify(summary)} in ${patches.size} patch files`);
void readdirSync;
void fieldUsage;

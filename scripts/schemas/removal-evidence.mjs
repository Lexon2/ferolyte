// Evidence for `x-removed`: when does the vanilla corpus (Mojang/bedrock-samples) stop using a component?
//   node scripts/schemas/removal-evidence.mjs minecraft:pushable [minecraft:other ...]
// For every format_version found in behavior_pack/entities it counts the files that contain the component
// (components + component groups) and the files that contain one of its replacements, then derives
//   lastUsed  = highest corpus format version that still uses the component
//   since     = the next corpus format version (the first one that no longer uses it), if a replacement is used there
// `since` is a proof only when it exists; otherwise the component must be `x-deprecated`, not `x-removed`.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parse } from 'jsonc-parser';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DIR = path.join(ROOT, '.cache/bedrock-samples/behavior_pack/entities');

const compare = (a, b) => {
  const [x, y] = [a, b].map((v) => v.split('.').map(Number));
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const d = (x[i] ?? 0) - (y[i] ?? 0);
    if (d !== 0) return d;
  }

  return 0;
};

export const loadCorpus = () => {
  if (!existsSync(DIR)) {
    throw new Error('Corpus missing: run `node scripts/schemas/fetch-samples.mjs`');
  }

  return readdirSync(DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const json = parse(readFileSync(path.join(DIR, f), 'utf8'));
      const entity = json?.['minecraft:entity'] ?? {};
      const groups = [entity.components ?? {}, ...Object.values(entity.component_groups ?? {})];
      const keys = new Set(groups.flatMap((g) => Object.keys(g)));
      // component key → every instance value in the file (for field level evidence)
      const values = new Map();
      for (const group of groups) {
        for (const [key, value] of Object.entries(group)) values.set(key, [...(values.get(key) ?? []), value]);
      }

      return { file: f, version: json?.format_version ?? '?', keys, values };
    });
};

export const evidenceFor = (corpus, component, replacements = []) => {
  const versions = [...new Set(corpus.map((c) => c.version))].filter((v) => v !== '?').sort(compare);
  const rows = versions.map((version) => {
    const files = corpus.filter((c) => c.version === version);

    return {
      version,
      files: files.length,
      used: files.filter((c) => c.keys.has(component)).length,
      replaced: files.filter((c) => replacements.some((r) => c.keys.has(r))).length,
    };
  });
  const usedVersions = rows.filter((r) => r.used > 0);
  const lastUsed = usedVersions.at(-1)?.version;
  const next = lastUsed === undefined ? undefined : rows.find((r) => compare(r.version, lastUsed) > 0);
  // Without a replacement in use there is no proof (a component can simply be rare): it stays `x-deprecated`.
  const proven = next !== undefined && next.used === 0 && replacements.length > 0 && next.replaced > 0;

  return { component, replacements, rows, lastUsed, since: proven ? next.version : undefined };
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const corpus = loadCorpus();
  const args = process.argv.slice(2);
  const replacements = {
    'minecraft:pushable': ['minecraft:pushable_by_entity', 'minecraft:pushable_by_block'],
  };
  for (const component of args.length ? args : ['minecraft:pushable']) {
    const e = evidenceFor(corpus, component, replacements[component] ?? []);
    console.log(JSON.stringify({ ...e, rows: undefined }));
    for (const r of e.rows) console.log(`  ${r.version}: ${r.used}/${r.files} use it, ${r.replaced} use a replacement`);
  }
}

/** Field level usage: `version → files using `field` in an instance of `component``. */
export const fieldUsage = (corpus, component, field) => {
  const usage = {};
  for (const c of corpus) {
    const used = (c.values.get(component) ?? []).some(
      (v) => v !== null && typeof v === 'object' && !Array.isArray(v) && field in v,
    );
    if (used) usage[c.version] = (usage[c.version] ?? 0) + 1;
  }

  return usage;
};

// Classifies every difference between the generated SDK and the official Mojang schemas.
//   node scripts/schemas/classify-official.mjs [--json]
// Component level: SDK-only (removed / never official) and official-only (missing in the SDK).
// Field level (components that exist on both sides and whose official schema has a body):
//   official-only  → `real` (add the field) | `noise` (the SDK models the shape with a shared type)
//   SDK-only       → `removed` (official history proves the field was dropped) | `legacy` (vanilla still uses it)
//                    | `unproven` (neither) — the last two are `x-deprecated`, never `x-removed`.
// Writes docs/roadmap/official-diffs.json (consumed by generate-official-patches.mjs and the ignored-diffs test).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  componentPresence,
  fieldHistory,
  officialIndex,
  officialVersions,
  propertyNames,
} from './official.mjs';
import { fieldUsage, loadCorpus } from './removal-evidence.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const GENERATED = path.join(ROOT, 'packages/pack/content/generated');
const OUT = path.join(ROOT, 'docs/roadmap/official-diffs.json');

const readGenerated = (area, generatedDir) => {
  const registry = readFileSync(path.join(generatedDir, area, 'registry.ts'), 'utf8');
  const entries = [...registry.matchAll(/entry\('([^']+)', '([^']+)', '(\w+)'/g)].map((m) => ({
    key: m[1],
    sdkKey: m[2],
    kind: m[3],
  }));
  const maps = readFileSync(path.join(generatedDir, area, 'key-maps.ts'), 'utf8');
  const keyMaps = JSON.parse(maps.slice(maps.indexOf('= {') + 2, maps.lastIndexOf('};') + 1));

  return { entries: entries.filter((e) => e.kind === 'component' || e.kind === 'behavior'), keyMaps };
};

export const classify = (generatedDir = GENERATED) => {
  const corpus = existsSync(path.join(ROOT, '.cache/bedrock-samples/behavior_pack/entities')) ? loadCorpus() : [];
  const diffs = [];

  for (const area of ['entity', 'item', 'block']) {
    const versions = officialVersions(area);
    const latest = versions.at(-1);
    const index = officialIndex(area, latest);
    const presence = componentPresence(area);
    const { entries, keyMaps } = readGenerated(area, generatedDir);
    const sdkKeys = new Set(entries.map((e) => e.key));

    // ---- components
    for (const e of entries) {
      if (index.has(e.key)) continue;
      const seen = presence.get(e.key);
      const usage = {};
      for (const c of corpus) if (area === 'entity' && c.keys.has(e.key)) usage[c.version] = (usage[c.version] ?? 0) + 1;
      diffs.push({
        area,
        component: e.key,
        field: undefined,
        side: 'sdk-only',
        official: seen ? `official ${seen[0]}–${seen.at(-1)} (then dropped)` : 'never in the official index',
        vanilla: usage,
      });
    }
    for (const key of index.keys()) {
      if (sdkKeys.has(key)) continue;
      diffs.push({
        area,
        component: key,
        field: undefined,
        side: 'official-only',
        official: `official ${presence.get(key)[0]}–${presence.get(key).at(-1)}`,
        hasBody: index.get(key) !== undefined,
      });
    }

    // ---- fields
    for (const e of entries) {
      if (!index.has(e.key)) continue;
      const props = propertyNames(index.get(e.key));
      if (props === undefined || props.size === 0) continue;
      const map = keyMaps[`${e.kind}:${e.sdkKey}`] ?? {};
      const sdkProps = new Set(Object.values(map.p ?? {}).map(([snake]) => snake));
      const { history } = fieldHistory(area, e.key);

      for (const field of props) {
        if (sdkProps.has(field)) continue;
        diffs.push({
          area,
          component: e.key,
          field,
          side: 'official-only',
          classification: map.n ? 'noise' : 'real',
          reason: map.n ? `the SDK models this component with the shared type "${map.n}"` : 'official field missing in the SDK',
          officialVersions: history.get(field),
        });
      }
      for (const field of sdkProps) {
        if (props.has(field)) continue;
        const officialSeen = [...history.keys()].includes(field) ? history.get(field) : undefined;
        const usage = area === 'entity' ? fieldUsage(corpus, e.key, field) : {};
        const used = Object.keys(usage).length > 0;
        diffs.push({
          area,
          component: e.key,
          field,
          side: 'sdk-only',
          classification: officialSeen ? 'removed' : used ? 'legacy' : 'unproven',
          reason: officialSeen
            ? `official schema had it in ${officialSeen[0]}–${officialSeen.at(-1)} and dropped it afterwards`
            : used
              ? 'absent from every official version but used by the vanilla corpus'
              : 'absent from every official version and unused by the vanilla corpus',
          officialVersions: officialSeen,
          vanilla: usage,
        });
      }
    }
  }

  return diffs;
};

/** `area|component|field` of a diff (field empty for components). */
export const diffId = (d) => `${d.area}|${d.component}|${d.field ?? ''}`;

/**
 * Diffs that are neither fixed nor marked: SDK-only components/fields must carry `x-removed`/`x-deprecated`
 * (read back from the generated registry / key maps); everything else has to be listed in ignored-diffs.json.
 */
export const unresolved = (diffs, generatedDir = GENERATED) => {
  const cache = {};
  const load = (area) => {
    cache[area] ??= (() => {
      const registry = readFileSync(path.join(generatedDir, area, 'registry.ts'), 'utf8');
      // A registry line is `entry(key, sdkKey, kind, flag, deprecated, removed, freeForm)`.
      const marked = new Set(
        registry
          .split(String.fromCharCode(10))
          .filter((line) => line.includes("entry('") && (line.includes(', "') || line.includes(', true,') || line.includes('{"since"')))
          .map((line) => line.split("entry('")[1].split("'")[0]),
      );

      return { marked, ...readGenerated(area, generatedDir) };
    })();

    return cache[area];
  };

  return diffs.filter((d) => {
    if (d.side !== 'sdk-only') return true;
    const { marked, entries, keyMaps } = load(d.area);
    if (!d.field) return !marked.has(d.component);
    const entry = entries.find((e) => e.key === d.component);
    const p = keyMaps[`${entry.kind}:${entry.sdkKey}`]?.p ?? {};
    const hit = Object.values(p).find(([snake]) => snake === d.field);

    return !(hit?.[2] && ('d' in hit[2] || 'r' in hit[2]));
  });
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const diffs = classify();
  writeFileSync(OUT, `${JSON.stringify(diffs, null, 1)}\n`);
  const count = {};
  for (const d of diffs) {
    const k = `${d.area} ${d.field ? 'field' : 'component'} ${d.side} ${d.classification ?? ''}`.trim();
    count[k] = (count[k] ?? 0) + 1;
  }
  console.log(JSON.stringify(count, null, 1));
  console.log(`wrote ${path.relative(ROOT, OUT)} (${diffs.length} diffs)`);
}

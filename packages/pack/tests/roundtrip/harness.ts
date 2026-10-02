/**
 * Round-trip harness (T14a): "everything Minecraft accepts, the SDK accepts".
 *
 * Component instances come from the vanilla bedrock-samples corpus and from
 * variants generated out of the Blockception schemas (one per oneOf/anyOf/type
 * branch). Each instance is converted snake_case → camelCase, built with the
 * SDK and compared with the original after normalisation.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parse as parseJsonc } from 'jsonc-parser';
import ts from 'typescript';

import { collectDiagnostics } from '@ferolyte/cli/compiler/check/diagnostics-collector';
import { blockComponentRegistry, blockTraitRegistry } from '@ferolyte/pack/content/generated/block/registry';
import { itemComponentRegistry } from '@ferolyte/pack/content/generated/item/registry';
import { BlockBuilder } from '@ferolyte/pack/content/block/block-builder';
import { ItemBuilder } from '@ferolyte/pack/content/item/item-builder';
import type { KeyMapNode } from '@ferolyte/pack/content/generated/key-map';
import {
  entityBehaviorRegistry,
  entityComponentRegistry,
} from '@ferolyte/pack/content/generated/entity/registry';
import { ServerEntityBuilder } from '@ferolyte/pack/content/server-entity/server-entity-builder';

import {
  collectDocuments,
  generatedKindOf,
  isDocumentArea,
  runDocument,
} from './documents';

export type Area =
  | 'entity'
  | 'entity_behavior'
  | 'item'
  | 'block'
  | 'attachable'
  | 'render_controller'
  | 'recipe'
  | 'spawn_rule'
  | 'client_entity'
  | 'animation_controller';
export type Category =
  | 'REJECTED'
  | 'TYPE'
  | 'LOST_FIELD'
  | 'CHANGED'
  | 'UNKNOWN_COMPONENT';
export const CATEGORIES: Category[] = [
  'REJECTED',
  'TYPE',
  'LOST_FIELD',
  'CHANGED',
  'UNKNOWN_COMPONENT',
];

export interface Instance {
  area: Area;
  /** Vanilla key, e.g. `minecraft:behavior.avoid_block`. */
  component: string;
  value: unknown;
  source: 'vanilla' | 'variant';
  origin: string;
}

export interface Detail {
  category: Category;
  path: string;
  expected?: unknown;
  actual?: unknown;
  message?: string;
}

export interface Failure {
  area: Area;
  component: string;
  source: Instance['source'];
  origin: string;
  categories: Category[];
  details: Detail[];
  /** Original (vanilla shape) instance. */
  json: unknown;
}

export interface RoundtripResult {
  total: number;
  passed: number;
  failures: Failure[];
}

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '../../../..');
export const SAMPLES_DIR = path.join(ROOT, '.cache/bedrock-samples');
export const SCHEMAS_DIR = path.join(ROOT, '.cache/bedrock-schemas');

export const cachesAvailable =
  existsSync(path.join(SAMPLES_DIR, 'behavior_pack', 'entities')) &&
  existsSync(path.join(SCHEMAS_DIR, 'behavior', 'entities', 'entities.json'));

// ---------------------------------------------------------------- naming

const snakeToCamel = (key: string) =>
  key.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());

/** `minecraft:navigation.walk` → `navigationWalk`, `minecraft:foo_bar` → `fooBar`. */
export const toSdkKey = (component: string): string =>
  snakeToCamel(
    component
      .replace(/^minecraft:behavior\./, '')
      .replace(/^minecraft:/, '')
      .replace(/\.([a-z])/g, (_, c: string) => `_${c}`),
  );

/** Maps whose keys are user data and must stay verbatim. */
const FREE_FORM = new Set([
  'properties',
  'states',
  'set_property',
  'add',
  'remove',
  'family',
  'families',
  'tags',
  'event_names',
]);

const convertKey = (key: string) =>
  /^[a-z][a-z0-9]*(_[a-z0-9]+)+$/.test(key) ? snakeToCamel(key) : key;

export const camelize = (value: unknown, parentKey = ''): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => camelize(item, parentKey));
  }
  if (typeof value !== 'object' || value === null) {
    return value;
  }
  const keepKeys = FREE_FORM.has(parentKey);

  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [
      keepKeys ? key : convertKey(key),
      camelize(child, key),
    ]),
  );
};

// ---------------------------------------------------------------- corpus

const readJson = (file: string): any => {
  try {
    return parseJsonc(readFileSync(file, 'utf8'));
  } catch {
    return undefined;
  }
};

const jsonFiles = (dir: string): string[] =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
        entry.isDirectory()
          ? jsonFiles(path.join(dir, entry.name))
          : entry.name.endsWith('.json')
            ? [path.join(dir, entry.name)]
            : [],
      )
    : [];

const areaOfEntityKey = (key: string): Area =>
  key.startsWith('minecraft:behavior.') ? 'entity_behavior' : 'entity';

export const collectVanilla = (): Instance[] => {
  const out: Instance[] = [];
  const bp = path.join(SAMPLES_DIR, 'behavior_pack');
  const add = (
    area: Area,
    components: Record<string, unknown> | undefined,
    origin: string,
  ) => {
    for (const [component, value] of Object.entries(components ?? {})) {
      if (component.startsWith('minecraft:') || component.includes(':')) {
        out.push({ area, component, value, source: 'vanilla', origin });
      }
    }
  };
  const split = (components: Record<string, unknown>, origin: string) => {
    const behaviors: Record<string, unknown> = {};
    const rest: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(components ?? {})) {
      (areaOfEntityKey(k) === 'entity_behavior' ? behaviors : rest)[k] = v;
    }
    add('entity_behavior', behaviors, origin);
    add('entity', rest, origin);
  };

  for (const file of jsonFiles(path.join(bp, 'entities'))) {
    const entity = readJson(file)?.['minecraft:entity'];
    const origin = path.relative(SAMPLES_DIR, file).replace(/\\/g, '/');
    split(entity?.components ?? {}, origin);
    for (const group of Object.values<any>(entity?.component_groups ?? {})) {
      split(group, origin);
    }
  }
  for (const file of jsonFiles(path.join(bp, 'items'))) {
    add(
      'item',
      readJson(file)?.['minecraft:item']?.components,
      path.relative(SAMPLES_DIR, file).replace(/\\/g, '/'),
    );
  }
  for (const file of jsonFiles(path.join(bp, 'blocks'))) {
    const block = readJson(file)?.['minecraft:block'];
    const origin = path.relative(SAMPLES_DIR, file).replace(/\\/g, '/');
    add('block', block?.components, origin);
    for (const permutation of block?.permutations ?? []) {
      add('block', permutation?.components, origin);
    }
  }

  return out;
};

// ------------------------------------------------- schema variants generator

type Schema = any;

const loadCompiled = (file: string): Schema =>
  JSON.parse(readFileSync(path.join(SCHEMAS_DIR, file), 'utf8'));

const makeGenerator = (root: Schema) => {
  const resolve = (schema: Schema, depth = 0): Schema => {
    let node = schema;
    let guard = 0;
    while (node?.$ref && guard++ < 20) {
      const name = String(node.$ref).replace('#/definitions/', '');
      node = root.definitions?.[name];
    }

    return depth > 40 ? undefined : node;
  };

  const MAX_DEPTH = 9;
  // Node budget per component keeps recursive schemas (filters, events) cheap.
  let budget = 0;
  const leaf = (schema: Schema): unknown => {
    if (schema.const !== undefined) return schema.const;
    if (schema.enum?.length) return schema.enum[0];
    const type = Array.isArray(schema.type) ? schema.type[0] : schema.type;
    switch (type) {
      case 'boolean':
        return true;
      case 'integer':
      case 'number': {
        const min = schema.minimum ?? schema.exclusiveMinimum;
        const max = schema.maximum;
        let value = 1;
        if (min !== undefined && value < min) value = min + (schema.exclusiveMinimum !== undefined ? 1 : 0);
        if (max !== undefined && value > max) value = max;

        return value;
      }
      case 'array':
        return schema.minItems > 0 && !Array.isArray(schema.items) && schema.items
          ? [minimal(schema.items, 9)]
          : [];
      case 'object':
        return {};
      case 'string':
      default:
        // A pattern cannot be generated: use the first documented example when there is one.
        if (schema.$comment === 'molang') return '1';
        if (typeof schema.examples?.[0] === 'string') return schema.examples[0];
        if (schema.pattern !== undefined) {
          // Try a few plausible shapes until one matches the pattern.
          const re = new RegExp(schema.pattern);
          const guess = ['x', 'ab', 'a:b', 'geometry.ab', 'loot_tables/x.json', 'abc_def', 'a.b'].find((g) => re.test(g));
          if (guess !== undefined) return guess;
        }

        return 'x';
    }
  };

  /** Instances of `schema`: one per oneOf/anyOf/type branch (+ per property). */
  const variants = (input: Schema, depth: number): unknown[] => {
    const schema = resolve(input);
    if (schema === undefined || depth > MAX_DEPTH || --budget < 0) return [];

    const branches = schema.oneOf ?? schema.anyOf;
    if (Array.isArray(branches)) {
      return branches.flatMap((branch) => variants(branch, depth + 1));
    }
    if (Array.isArray(schema.allOf)) {
      const merged = Object.assign(
        {},
        ...schema.allOf.map((part: Schema) => resolve(part) ?? {}),
      );

      return variants({ ...schema, ...merged, allOf: undefined }, depth + 1);
    }
    if (Array.isArray(schema.type) && schema.type.length > 1) {
      return schema.type.flatMap((type: string) =>
        variants({ ...schema, type }, depth + 1),
      );
    }
    const type = schema.type;
    if (Array.isArray(schema.items)) {
      // Tuple: one value per position.
      return [schema.items.map((item: Schema) => minimal(item, depth + 1))];
    }
    if (type === 'array' || schema.items) {
      const item = variants(schema.items ?? {}, depth + 1);

      return item.length > 0 ? item.map((value) => [value]) : [leaf(schema)];
    }
    if (type === 'object' || schema.properties) {
      const base = minimal(schema, depth);
      // Nested empty objects are noise (`{}` for a branch that has properties).
      const out: unknown[] =
        depth > 1 &&
        Object.keys(base as object).length === 0 &&
        Object.keys(schema.properties ?? {}).length > 0
          ? []
          : [base];
      for (const [key, child] of Object.entries<Schema>(schema.properties ?? {})) {
        // Strings constrained by a pattern cannot be generated meaningfully.
        if (resolve(child)?.pattern !== undefined) continue;
        for (const value of variants(child, depth + 1).slice(0, 6)) {
          out.push({ ...(base as object), [key]: value });
        }
      }

      return out;
    }

    // Constrained strings without an example cannot be generated meaningfully.
    if (schema.type === 'string' && schema.pattern !== undefined && typeof schema.examples?.[0] !== 'string') {
      return [];
    }

    return [leaf(schema)];
  };

  const minimal = (input: Schema, depth: number): unknown => {
    const schema = resolve(input);
    if (schema === undefined || depth > MAX_DEPTH) return {};
    const branches = schema.oneOf ?? schema.anyOf;
    if (Array.isArray(branches)) return minimal(branches[0], depth + 1);
    if (schema.type === 'object' || schema.properties) {
      const out: Record<string, unknown> = {};
      const keys = Object.keys(schema.properties ?? {});
      // Partial ranges ({ min } / { range_min }) are not meaningful instances: fill both ends.
      if (
        (schema.required ?? []).length === 0 &&
        keys.length === 2 &&
        keys.every((key) => /^(range_)?(min|max)$/.test(key))
      ) {
        return Object.fromEntries(keys.map((key) => [key, 1]));
      }
      if ((schema.required ?? []).length === 0 && schema.minProperties > 0 && keys.length > 0) {
        // minProperties: one property is the smallest valid instance.
        const first = schema.properties[keys[0]];
        out[keys[0]] = minimal(first, depth + 1);
      }
      for (const key of schema.required ?? []) {
        const child = schema.properties?.[key];
        if (child !== undefined) out[key] = minimal(child, depth + 1);
      }

      return out;
    }
    if (schema.type === 'array') return leaf(schema);

    return leaf(schema);
  };

  return {
    variants: (schema: Schema, depth: number) => {
      budget = 1500;

      return variants(schema, depth);
    },
    resolve,
  };
};

export const collectVariants = (): Instance[] => {
  const out: Instance[] = [];
  const files: [Area[], string, string][] = [
    [['entity', 'entity_behavior'], 'behavior/entities/entities.json', 'entities'],
    [['item'], 'behavior/items/items.json', 'items'],
    [['block'], 'behavior/blocks/blocks.json', 'blocks'],
  ];
  for (const [areas, file] of files) {
    const root = loadCompiled(file);
    const { variants, resolve } = makeGenerator(root);
    const topKey = Object.keys(root.properties).find((key) =>
      key.startsWith('minecraft:'),
    ) as string;
    const top = resolve(root.properties[topKey]);
    const components = resolve(top?.properties?.components);
    for (const [component, schema] of Object.entries<Schema>(
      components?.properties ?? {},
    )) {
      const area: Area =
        areas.length === 2
          ? areaOfEntityKey(component)
          : areas[0];
      const seen = new Set<string>();
      for (const value of variants(schema, 0)) {
        const key = JSON.stringify(value);
        if (seen.has(key) || seen.size >= 40) continue;
        seen.add(key);
        out.push({
          area,
          component,
          value,
          source: 'variant',
          origin: `schema:${file}`,
        });
      }
    }
  }

  return out;
};

// ----------------------------------------------------------- normalisation

const isRange = (v: any): v is { min: number; max: number } =>
  typeof v === 'object' &&
  v !== null &&
  !Array.isArray(v) &&
  Object.keys(v).every((k) => k === 'min' || k === 'max') &&
  typeof v.min === 'number' &&
  typeof v.max === 'number';

/** Range forms and 1-element arrays collapse to a canonical shape. */
export const normalise = (value: any): any => {
  if (Array.isArray(value)) {
    const mapped = value.map(normalise);

    return mapped.length === 1 && typeof mapped[0] !== 'number'
      ? mapped[0]
      : mapped;
  }
  if (isRange(value)) return [value.min, value.max];
  // `{ range_min, range_max }` is the third spelling of a range.
  if (
    typeof value === 'object' &&
    value !== null &&
    Object.keys(value).sort().join() === 'range_max,range_min'
  ) {
    return [value.range_min, value.range_max];
  }
  // A filter list is `all_of`.
  if (
    typeof value === 'object' &&
    value !== null &&
    Object.keys(value).length === 1 &&
    Array.isArray(value.all_of)
  ) {
    return normalise(value.all_of);
  }
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, normalise(v)]),
    );
  }

  return value;
};

/** Differences of `expected` (original) against `actual` (SDK output). */
export const diff = (
  expected: any,
  actual: any,
  at = '',
  out: Detail[] = [],
): Detail[] => {
  if (actual === undefined) {
    out.push({ category: 'LOST_FIELD', path: at || '.', expected });

    return out;
  }
  if (
    typeof expected === 'object' &&
    expected !== null &&
    !Array.isArray(expected) &&
    typeof actual === 'object' &&
    actual !== null &&
    !Array.isArray(actual)
  ) {
    for (const key of Object.keys(expected)) {
      diff(expected[key], actual[key], `${at}.${key}`, out);
    }

    return out;
  }
  if (Array.isArray(expected) && Array.isArray(actual)) {
    if (expected.length !== actual.length) {
      out.push({ category: 'CHANGED', path: at || '.', expected, actual });

      return out;
    }
    expected.forEach((item, i) => diff(item, actual[i], `${at}[${i}]`, out));

    return out;
  }
  if (JSON.stringify(expected) !== JSON.stringify(actual)) {
    out.push({ category: 'CHANGED', path: at || '.', expected, actual });
  }

  return out;
};

// ------------------------------------------------------------------ build

const factories: Partial<Record<Area, Record<string, unknown>>> = {
  entity: entityComponentRegistry,
  entity_behavior: entityBehaviorRegistry,
  item: itemComponentRegistry,
  block: blockComponentRegistry,
};

const wrapConfig = (area: Area, sdkKey: string, config: unknown) => {
  switch (area) {
    case 'entity':
      return { identifier: 'rt:entity', components: { [sdkKey]: config } };
    case 'entity_behavior':
      return {
        identifier: 'rt:entity',
        components: { behaviors: { [sdkKey]: config } },
      };
    default:
      return { identifier: 'rt:thing', components: { [sdkKey]: config } };
  }
};

const buildOutput = (area: Area, config: any): Record<string, unknown> => {
  switch (area) {
    case 'entity':
    case 'entity_behavior':
      return (
        (new ServerEntityBuilder(config as never)
          .withBuildContext({ contentType: 'server-entity' })
          .build() as any)[
          'minecraft:entity'
        ].components ?? {}
      );
    case 'item':
      return (
        (new ItemBuilder(config as never)
          .withBuildContext({ contentType: 'item' })
          .build() as any)['minecraft:item']
          .components ?? {}
      );
    case 'block':
      return (
        (new BlockBuilder(config as never)
          .withBuildContext({ contentType: 'block' })
          .build() as any)['minecraft:block']
          .components ?? {}
      );
  }
};

/** snake_case → camelCase with the exact generated key map (free-form maps stay verbatim). */
export const camelizeWithMap = (value: unknown, node: KeyMapNode | undefined): unknown => {
  if (node === undefined) {
    return value;
  }
  if (node.n !== undefined) {
    return camelize(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => camelizeWithMap(item, node.i));
  }
  if (typeof value !== 'object' || value === null) {
    return value;
  }
  // A single item where the schema also allows a list.
  if (node.p === undefined && node.a === undefined && node.i !== undefined) {
    return camelizeWithMap(value, node.i);
  }
  const byPropery = new Map(
    Object.entries(node.p ?? {}).map(([camel, [snake, child]]) => [snake, [camel, child] as const]),
  );

  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => {
      const hit = byPropery.get(key);

      return hit !== undefined
        ? [hit[0], camelizeWithMap(child, hit[1])]
        : [key, camelizeWithMap(child, node.a)];
    }),
  );
};

export const runInstance = (
  instance: Instance,
): { failure?: Failure; sdkKey: string; camel: unknown } => {
  const { area, component, value } = instance;
  if (isDocumentArea(area)) {
    return runDocument(instance);
  }
  const registry = factories[area] as Record<string, unknown>;
  const generatedKey = Object.values(registry).find(
    (entry) => (entry as { key?: string }).key === component,
  ) as { sdkKey: string } | undefined;
  const sdkKey = generatedKey?.sdkKey ?? toSdkKey(component);
  const entry = (registry as Record<string, { map?: KeyMapNode }>)[sdkKey];
  const camel =
    entry?.map !== undefined
      ? camelizeWithMap(value, entry.map)
      : camelize(value, sdkKey);
  const base = {
    area,
    component,
    source: instance.source,
    origin: instance.origin,
    json: value,
  };

  if (!(sdkKey in registry)) {
    return {
      sdkKey,
      camel,
      failure: {
        ...base,
        categories: ['UNKNOWN_COMPONENT'],
        details: [{ category: 'UNKNOWN_COMPONENT', path: '.' }],
      },
    };
  }

  const collector = collectDiagnostics({ silent: true });
  let output: Record<string, unknown> = {};
  let thrown: string | undefined;
  try {
    output = buildOutput(area, wrapConfig(area, sdkKey, camel));
  } catch (error) {
    thrown = error instanceof Error ? error.message : String(error);
  } finally {
    collector.stop();
  }

  const errors = collector.records
    .filter((r) => r.severity === 'error')
    .map((r) => `${r.fieldPath}: ${r.message}`);
  const actual = output[component];

  if (thrown !== undefined || actual === undefined || errors.length > 0) {
    return {
      sdkKey,
      camel,
      failure: {
        ...base,
        categories: ['REJECTED'],
        details: [
          {
            category: 'REJECTED',
            path: '.',
            message: thrown ?? errors.join('; ') ?? 'component dropped',
            actual: actual === undefined ? undefined : actual,
          },
        ],
      },
    };
  }

  const details = diff(normalise(value), normalise(actual));
  if (details.length > 0) {
    return {
      sdkKey,
      camel,
      failure: {
        ...base,
        categories: [...new Set(details.map((d) => d.category))],
        details,
      },
    };
  }

  return { sdkKey, camel };
};

// -------------------------------------------------------------- TS check

const typeNames: Partial<Record<Area, string>> = {
  attachable: "DocumentConfigs['attachable']",
  render_controller: "DocumentConfigs['renderController']",
  recipe: "DocumentConfigs['recipe']",
  spawn_rule: "DocumentConfigs['spawnRule']",
  entity: 'EntityComponents',
  entity_behavior: "NonNullable<EntityComponents['behaviors']>",
  item: 'ItemComponents',
  block: 'BlockComponents',
};

/** Marks instances whose camelCase config does not type-check against the SDK interfaces. */
export const typeCheck = (
  items: { instance: Instance; sdkKey: string; camel: unknown }[],
): Map<number, string> => {
  const file = path.join(here, '__typecheck.generated.ts');
  const lines = [
    "import type { EntityComponents } from '@ferolyte/pack/content/server-entity/interfaces/entity-components';",
    "import type { ItemComponents } from '@ferolyte/pack/content/item/interfaces/item-config';",
    "import type { BlockComponents } from '@ferolyte/pack/content/block/interfaces/block-config';",
    "import type { DocumentConfigs } from '@ferolyte/pack/content/documents/convert-document';",
  ];
  const lineOf = new Map<number, number>();
  items.forEach(({ instance, sdkKey, camel }, index) => {
    lineOf.set(lines.length + 1, index);
    lines.push(
      `export const t${index}: ${typeNames[instance.area]} = ${JSON.stringify(
        generatedKindOf(instance.area) !== undefined ? camel : { [sdkKey]: camel },
      )};`,
    );
  });

  const configPath = path.join(ROOT, 'packages/pack/tsconfig.json');
  const parsed = ts.parseJsonConfigFileContent(
    ts.readConfigFile(configPath, ts.sys.readFile).config,
    ts.sys,
    path.dirname(configPath),
  );
  const options: ts.CompilerOptions = {
    ...parsed.options,
    noEmit: true,
    rootDir: ROOT,
    skipLibCheck: true,
    // The pack tsconfig maps @ferolyte/common to the sources.
  };
  const host = ts.createCompilerHost(options);
  const original = host.readFile.bind(host);
  host.readFile = (name) =>
    path.resolve(name) === path.resolve(file) ? lines.join('\n') : original(name);
  host.fileExists = ((exists) => (name: string) =>
    path.resolve(name) === path.resolve(file) || exists(name))(
    host.fileExists.bind(host),
  );
  const program = ts.createProgram([file], options, host);
  const result = new Map<number, string>();
  for (const diagnostic of ts.getPreEmitDiagnostics(program, program.getSourceFile(file))) {
    if (diagnostic.file === undefined || diagnostic.start === undefined) continue;
    const { line } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
    const index = lineOf.get(line + 1);
    if (index !== undefined && !result.has(index)) {
      result.set(index, ts.flattenDiagnosticMessageText(diagnostic.messageText, ' '));
    }
  }

  return result;
};

// -------------------------------------------------------------------- run

export const runRoundtrip = (): RoundtripResult => {
  const seen = new Set<string>();
  const instances = [
    ...collectVanilla(),
    ...collectDocuments(),
    ...collectVariants(),
  ].filter(
    (instance) => {
      const key = `${instance.area}|${instance.component}|${JSON.stringify(instance.value)}`;
      if (seen.has(key)) return false;
      seen.add(key);

      return true;
    },
  );

  const runs = instances.map((instance) => ({
    instance,
    ...runInstance(instance),
  }));

  // TS check only for components the SDK knows (the others are UNKNOWN already).
  const known = runs
    .map((run, index) => ({ run, index }))
    .filter(
      ({ run }) =>
        run.failure?.categories[0] !== 'UNKNOWN_COMPONENT' &&
        (!isDocumentArea(run.instance.area) ||
          generatedKindOf(run.instance.area) !== undefined),
    );
  const typeErrors = typeCheck(
    known.map(({ run }) => ({
      instance: run.instance,
      sdkKey: run.sdkKey,
      camel: run.camel,
    })),
  );
  known.forEach(({ run }, k) => {
    const message = typeErrors.get(k);
    if (message === undefined) return;
    const failure: Failure = run.failure ?? {
      area: run.instance.area,
      component: run.instance.component,
      source: run.instance.source,
      origin: run.instance.origin,
      categories: [],
      details: [],
      json: run.instance.value,
    };
    failure.categories = [...new Set<Category>([...failure.categories, 'TYPE'])];
    failure.details.push({ category: 'TYPE', path: '.', message });
    run.failure = failure;
  });

  const failures = runs.flatMap((run) => (run.failure ? [run.failure] : []));

  return {
    total: instances.length,
    passed: instances.length - failures.length,
    failures,
  };
};

// Emitters: schema tree → TypeScript types, key maps and validation schemas.
import { createHash } from 'node:crypto';

export const snakeToCamel = (key) =>
  /^[a-z][a-z0-9]*(_[a-z0-9]+)+$/.test(key)
    ? key.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase())
    : key.replace(/[^A-Za-z0-9_$]/g, '_');

export const pascal = (key) => key.charAt(0).toUpperCase() + key.slice(1);

const isIdentifier = (key) => /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key);
const quote = (key) => (isIdentifier(key) ? key : JSON.stringify(key));

const hash = (value) =>
  createHash('sha1').update(JSON.stringify(value)).digest('hex').slice(0, 6);

const jsdoc = (node, minecraftKey, indent) => {
  const lines = [];
  const description = node.description ?? node.title;
  if (description) {
    lines.push(
      ...String(description)
        .replace(/\*\//g, '*\\/')
        .split(/\r?\n/)
        .map((line) => line.trimEnd()),
    );
  }
  if (node.default !== undefined && typeof node.default !== 'object') {
    lines.push(`@default ${JSON.stringify(node.default)}`);
  }
  const types = [node.type].flat();
  if (types.includes('integer') && !types.includes('number')) {
    // TypeScript has no integer type: say it in the docs, the validator rejects fractions.
    lines.push('@integer Whole number only (fractions are rejected by the build).');
  }
  if (node.deprecated === true) {
    lines.push('@deprecated');
  }
  if (node['x-removed']) {
    const r = node['x-removed'];
    lines.push(
      `@deprecated Not in the schemas since ${r.since}${r.replacement?.length ? ` — use ${r.replacement.map((x) => `\`${x}\``).join(' / ')}` : ''}. Not written when the format version is ${r.since} or newer.`,
    );
  } else if (node['x-deprecated']) {
    lines.push(`@deprecated ${node['x-deprecated'].reason}`);
  }
  if (node['x-since']) {
    lines.push(`Introduced in format version ${node['x-since']} (older versions may reject it).`);
  }
  if (minecraftKey) {
    lines.push(`@minecraft ${minecraftKey}`);
  }
  if (lines.length === 0) {
    return '';
  }
  if (lines.length === 1) {
    return `${indent}/** ${lines[0]} */\n`;
  }

  return `${indent}/**\n${lines.map((l) => `${indent} * ${l}`.trimEnd()).join('\n')}\n${indent} */\n`;
};

const SHARED_TS = {
  filters: 'EntityFilters',
  trigger: 'string | PartialEntityEventTrigger | (string | PartialEntityEventTrigger)[]',
  'range-object': 'MinMaxRange',
  'range-any': 'MinMaxRange',
  'range-int-or-object': 'MinMaxRange',
  molang: 'string | MolangExpr',
  'molang-number': 'string | number | MolangExpr',
};

/** TS type emitter; hoists large enums into `aliases`. */
export const createTypeEmitter = () => {
  const aliases = new Map();

  const enumType = (values) => {
    const literals = values.map((v) => JSON.stringify(v));
    if (values.length <= 8) {
      return literals.join(' | ');
    }
    const name = `Enum${hash(values)}`;
    aliases.set(name, `LooseString<${literals.join(' | ')}>`);

    return name;
  };

  const emit = (node, indent) => {
    if (node === undefined || node === null || typeof node !== 'object') {
      return 'unknown';
    }
    if (node['x-shared']) {
      return SHARED_TS[node['x-shared']];
    }
    if (node['x-recursive'] || node['x-unresolved']) {
      return 'unknown';
    }
    if (node.const !== undefined) {
      return JSON.stringify(node.const);
    }
    if (Array.isArray(node.enum)) {
      return enumType(node.enum);
    }
    const branches = node.oneOf ?? node.anyOf;
    if (Array.isArray(branches)) {
      const types = [...new Set(branches.map((b) => emit(b, indent)))];

      return types.length === 0 ? 'unknown' : types.join(' | ');
    }
    if (Array.isArray(node.allOf)) {
      const merged = {};
      for (const part of node.allOf) {
        Object.assign(merged, part, {
          properties: { ...merged.properties, ...part.properties },
          required: [...(merged.required ?? []), ...(part.required ?? [])],
        });
      }

      return emit({ ...merged, allOf: undefined }, indent);
    }
    if (Array.isArray(node.type)) {
      return [...new Set(node.type.map((type) => emit({ ...node, type }, indent)))].join(' | ');
    }
    switch (node.type) {
      case 'string':
        return 'string';
      case 'number':
      case 'integer':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'null':
        return 'null';
      case 'array': {
        if (Array.isArray(node.items)) {
          return `[${node.items.map((item) => emit(item, indent)).join(', ')}]`;
        }
        const item = emit(node.items, indent);
        // A single trigger is accepted where the schema wants a list (the runtime wraps it).
        if (node.items?.['x-shared'] === 'trigger') {
          return item;
        }

        return /[|&]/.test(item) ? `(${item})[]` : `${item}[]`;
      }
      default:
        break;
    }
    if (node.type === 'object' || node.properties || node.additionalProperties || node.patternProperties) {
      return emitObject(node, indent);
    }

    return 'unknown';
  };

  const emitObject = (node, indent) => {
    const props = Object.entries(node.properties ?? {});
    const free = [];
    if (node.additionalProperties && typeof node.additionalProperties === 'object') {
      free.push(emit(node.additionalProperties, indent));
    }
    for (const value of Object.values(node.patternProperties ?? {})) {
      free.push(emit(value, indent));
    }
    const freeType = free.length ? `Record<string, ${[...new Set(free)].join(' | ')}>` : undefined;

    if (props.length === 0) {
      return freeType ?? (node.additionalProperties === false ? 'Record<string, never>' : 'Record<string, unknown>');
    }
    const required = new Set(node.required ?? []);
    const inner = `${indent}  `;
    const body = props
      .map(([key, value]) => {
        const camel = value['x-sdk-name'] ?? snakeToCamel(key);

        return `${jsdoc(value, key, inner)}${inner}${quote(camel)}${required.has(key) ? '' : '?'}: ${emit(value, inner)};`;
      })
      .join('\n');
    const literal = `{\n${body}\n${indent}}`;

    return freeType ? `${literal} & ${freeType}` : literal;
  };

  return { emit, aliases };
};

/**
 * Key map node: `{ n?: shared, p?: { camel: [snake, node?] }, a?: node (free-form values), i?: node (items) }`.
 * Union branches are merged.
 */
export const buildKeyMap = (node) => {
  if (node === undefined || node === null || typeof node !== 'object') {
    return {};
  }
  if (node['x-shared']) {
    // `b`: a boolean in a Molang string field is written as 'true' / 'false' with a warning.
    return { n: node['x-shared'], ...(node['x-warn-boolean'] ? { b: 1 } : {}) };
  }
  const parts = [];
  const branches = node.oneOf ?? node.anyOf ?? node.allOf;
  if (Array.isArray(branches)) {
    parts.push(...branches.map(buildKeyMap));
    // `number | range`: a plain number must stay a number.
    if (
      !node.allOf &&
      branches.some((b) => b.type === 'number' || b.type === 'integer') &&
      parts.some((part) => part.n?.startsWith('range'))
    ) {
      parts.push({ s: 1 });
    }
  }
  if (Array.isArray(node.type)) {
    parts.push(...node.type.map((type) => buildKeyMap({ ...node, type, oneOf: undefined, anyOf: undefined })));
  }
  if (node.properties || node.additionalProperties || node.patternProperties) {
    const own = {};
    for (const [key, value] of Object.entries(node.properties ?? {})) {
      const child = buildKeyMap(value);
      own.p ??= {};
      const marker = fieldMarker(value);
      own.p[value['x-sdk-name'] ?? snakeToCamel(key)] = marker
        ? [key, child, marker]
        : Object.keys(child).length
          ? [key, child]
          : [key];
    }
    const free = [
      ...(typeof node.additionalProperties === 'object' ? [node.additionalProperties] : []),
      ...Object.values(node.patternProperties ?? {}),
    ];
    if (free.length > 0 || node.additionalProperties === true) {
      own.a = mergeMaps(free.map(buildKeyMap));
    }
    parts.push(own);
  }
  if (node.type === 'array' || node.items) {
    const items = Array.isArray(node.items)
      ? node.items.map(buildKeyMap)
      : [buildKeyMap(node.items)];
    parts.push({ i: mergeMaps(items), ...(node.oneOf || node.anyOf || Array.isArray(node.items) ? {} : { r: 1 }) });
  }

  return mergeMaps(parts);
};

/** Field lifecycle markers of a property schema → key map marker (`d` deprecated, `r` removed, `s` since). */
const fieldMarker = (schema) =>
  schema['x-removed']
    ? { r: { since: schema['x-removed'].since, replacement: schema['x-removed'].replacement } }
    : schema['x-deprecated']
      ? { d: schema['x-deprecated'].reason }
      : schema['x-since']
        ? { s: schema['x-since'] }
        : undefined;

const mergeEntry = (existing, entry) => {
  const child = mergeMaps([existing[1] ?? {}, entry[1] ?? {}]);
  const marker = existing[2] ?? entry[2];

  return marker ? [existing[0], child, marker] : Object.keys(child).length ? [existing[0], child] : [existing[0]];
};

const mergeMaps = (maps) => {
  const out = {};
  for (const map of maps) {
    for (const [key, value] of Object.entries(map)) {
      if (key === 'r') {
        continue;
      } else if (key === 's') {
        out.s = 1;
      } else if (key === 'b') {
        out.b = 1;
      } else if (key === 'n') {
        out.n ??= value;
      } else if (key === 'p') {
        out.p ??= {};
        for (const [camel, entry] of Object.entries(value)) {
          const existing = out.p[camel];
          out.p[camel] = existing
            ? mergeEntry(existing, entry)
            : entry;
        }
      } else {
        out[key] = out[key] ? mergeMaps([out[key], value]) : value;
      }
    }
  }

  // "single value must be wrapped into an array" only holds when every branch is an array.
  if (maps.length > 0 && maps.every((map) => map.r)) {
    out.r = 1;
  }

  return out;
};

const RANGE_OBJECT = {
  type: 'object',
  properties: { min: { type: 'number' }, max: { type: 'number' } },
  additionalProperties: false,
};

/** Validation schema: shared markers become the shape the normalizers produce. */
export const toValidationSchema = (node) => {
  if (Array.isArray(node)) {
    return node.map(toValidationSchema);
  }
  if (node === null || typeof node !== 'object') {
    return node;
  }
  const shared = node['x-shared'];
  if (shared) {
    return {
      filters: {},
      trigger: {},
      molang: { type: 'string' },
      'molang-number': { type: ['string', 'number'] },
      'range-object': { anyOf: [RANGE_OBJECT, { type: 'number' }] },
      'range-any': { type: ['number', 'array', 'object'] },
      'range-int-or-object': { type: ['integer', 'object'] },
    }[shared];
  }
  if (node['x-recursive'] || node['x-unresolved']) {
    return {};
  }

  // Blockception writes `oneOf` where Minecraft accepts any matching shape: validate with `anyOf`.
  return Object.fromEntries(
    Object.entries(node).map(([key, value]) => [
      key === 'oneOf' ? 'anyOf' : key,
      key === 'properties' || key === 'patternProperties'
        ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, toValidationSchema(v)]))
        : toValidationSchema(value),
    ]),
  );
};

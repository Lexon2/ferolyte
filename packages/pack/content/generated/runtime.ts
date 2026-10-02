import {
  ContentDiagnosticContext,
  logContentError,
  logContentWarning,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { isVersionAtLeast } from '@ferolyte/common/content/versions/compare-version';
import { MolangExpr } from '../molang/expr/expr';
import type {
  FieldMarker,
  GeneratedEntry,
  KeyMapNode,
  SharedKind,
} from './key-map';

/** Hand-written normalizers for shared types the generator does not model. */
export interface SharedNormalizers {
  filters: (value: unknown, ctx?: ContentDiagnosticContext) => unknown;
  trigger: (value: unknown, ctx?: ContentDiagnosticContext) => unknown;
}

type Path = (string | number)[];

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  !(value instanceof MolangExpr);

export const formatPath = (path: Path): string =>
  path.reduce<string>(
    (out, segment) =>
      typeof segment === 'number'
        ? `${out}[${segment}]`
        : out === ''
          ? segment
          : `${out}.${segment}`,
    '',
  );

const levenshtein = (a: string, b: string): number => {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = Math.min(
        row[j] + 1,
        row[j - 1] + 1,
        prev + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      prev = tmp;
    }
  }

  return row[b.length];
};

const snakeToCamel = (key: string) =>
  key.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());

const suggest = (key: string, node: KeyMapNode): string | undefined => {
  const camelKeys = Object.keys(node.p ?? {});
  const asCamel = snakeToCamel(key);
  if (camelKeys.includes(asCamel)) {
    return asCamel;
  }
  const best = camelKeys
    .map(
      (candidate) =>
        [
          candidate,
          levenshtein(key.toLowerCase(), candidate.toLowerCase()),
        ] as const,
    )
    .sort((a, b) => a[1] - b[1])[0];

  return best !== undefined && best[1] <= Math.max(2, key.length / 3)
    ? best[0]
    : undefined;
};

// -------------------------------------------------------------- normalizers

const toMolangSource = (value: unknown): unknown => {
  if (value instanceof MolangExpr) {
    return value.toString();
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return value;
};

const rangePair = (value: unknown): [number, number] | undefined => {
  if (typeof value === 'number') {
    return [value, value];
  }
  if (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every((item) => typeof item === 'number')
  ) {
    return [value[0], value[1]];
  }
  if (isPlainObject(value)) {
    const min = value.min ?? value.rangeMin;
    const max = value.max ?? value.rangeMax;
    if (typeof min === 'number' && typeof max === 'number') {
      return [min, max];
    }
  }

  return undefined;
};

const normalizeRange = (kind: SharedKind, value: unknown): unknown => {
  // Minecraft accepts a plain number wherever a range is allowed: keep it as written.
  if (typeof value === 'number') {
    return value;
  }
  const pair = rangePair(value);
  if (pair === undefined) {
    return value;
  }

  return kind === 'range-object' || kind === 'range-int-or-object'
    ? { min: pair[0], max: pair[1] }
    : [pair[0], pair[1]];
};
// ------------------------------------------------------------------ rename

interface RenameState {
  ctx?: ContentDiagnosticContext;
  normalizers: SharedNormalizers;
  /** `instancePath` (snake) → reported, to avoid duplicate ajv errors. */
  reported: Set<string>;
}

const ctxAt = (
  state: RenameState,
  path: Path,
): ContentDiagnosticContext | undefined => {
  if (state.ctx === undefined) {
    return undefined;
  }
  const own = formatPath(path);
  const base = state.ctx.fieldPath;
  const fieldPath =
    base === undefined || base === ''
      ? own || undefined
      : own === ''
        ? base
        : own.startsWith('[')
          ? `${base}${own}`
          : `${base}.${own}`;

  return { ...state.ctx, fieldPath };
};

const report = (
  state: RenameState,
  path: Path,
  message: string,
  severity: 'error' | 'warning' = 'error',
) => {
  (severity === 'error' ? logContentError : logContentWarning)(
    ctxAt(state, path),
    message,
  );
};

/**
 * Field lifecycle markers. Returns `false` when the field must not be written (removed at this format version).
 * Removed fields are errors from `since` on (proven by the official schema history), deprecated and
 * too-new fields only warn and are still written.
 */
const applyFieldMarker = (
  marker: FieldMarker,
  key: string,
  state: RenameState,
  path: Path,
): boolean => {
  const version = state.ctx?.formatVersion;
  if ('r' in marker) {
    const { since, replacement } = marker.r;
    const message = `"${key}" is not in the Bedrock schemas since ${since}${
      replacement?.length ? ` — use ${replacement.join(' / ')}` : ''
    }`;
    if (version !== undefined && isVersionAtLeast(version, since)) {
      report(state, path, `${message}; it is not written`);

      return false;
    }
    report(
      state,
      path,
      `${message}; format versions ${since} and newer reject it`,
      'warning',
    );
  } else if ('d' in marker) {
    report(state, path, `"${key}" is deprecated: ${marker.d}`, 'warning');
  } else if (version !== undefined && !isVersionAtLeast(version, marker.s)) {
    report(
      state,
      path,
      `"${key}" was introduced in format version ${marker.s}; older format versions may reject it`,
      'warning',
    );
  }

  return true;
};

const rename = (
  value: unknown,
  node: KeyMapNode,
  path: Path,
  state: RenameState,
  pointer = '',
): unknown => {
  if (value === undefined) {
    return undefined;
  }
  const withCtx = (): ContentDiagnosticContext | undefined =>
    ctxAt(state, path);

  switch (node.n) {
    case 'filters':
      return state.normalizers.filters(value, withCtx());
    case 'trigger':
      return state.normalizers.trigger(value, withCtx());
    case 'molang':
      return toMolangSource(value);
    case 'molang-number':
      return typeof value === 'number' ? value : toMolangSource(value);
    case 'range-object':
    case 'range-any':
    case 'range-int-or-object':
      return node.s === 1 && typeof value === 'number'
        ? value
        : normalizeRange(node.n, value);
    default:
      break;
  }

  if (node.r === 1 && !Array.isArray(value)) {
    value = [value];
  }
  if (Array.isArray(value)) {
    return node.i === undefined
      ? value
      : value.map((item, index) =>
          rename(
            item,
            node.i as KeyMapNode,
            [...path, index],
            state,
            `${pointer}/${index}`,
          ),
        );
  }
  if (!isPlainObject(value) || (node.p === undefined && node.a === undefined)) {
    return value;
  }

  const out: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value)) {
    if (child === undefined) {
      continue;
    }
    const hit = node.p?.[key];
    if (hit !== undefined) {
      if (
        hit[2] !== undefined &&
        !applyFieldMarker(hit[2], key, state, [...path, key])
      ) {
        continue;
      }
      out[hit[0]] = rename(
        child,
        hit[1] ?? {},
        [...path, key],
        state,
        `${pointer}/${hit[0]}`,
      );
    } else if (node.a !== undefined) {
      out[key] = rename(
        child,
        node.a,
        [...path, key],
        state,
        `${pointer}/${key}`,
      );
    } else {
      const hint = suggest(key, node);
      report(
        state,
        [...path, key],
        `Unknown field "${key}"${hint !== undefined ? `. Did you mean "${hint}"?` : ''}`,
      );
      // Unknown fields are reported but never written: Minecraft may refuse the whole file.
      state.reported.add(`${pointer}/${key}`);
    }
  }

  return out;
};

// ---------------------------------------------------------------- validate

/** Maps a snake_case JSON pointer back to the camelCase path of the user config. */
const toCamelPath = (pointer: string, root: KeyMapNode): Path => {
  const path: Path = [];
  let node: KeyMapNode | undefined = root;
  for (const raw of pointer.split('/').slice(1)) {
    const segment = raw.replace(/~1/g, '/').replace(/~0/g, '~');
    if (/^\d+$/.test(segment) && node?.i !== undefined) {
      path.push(Number(segment));
      node = node.i;
      continue;
    }
    const camel: [string, [string, KeyMapNode?, FieldMarker?]] | undefined = Object.entries(
      node?.p ?? {},
    ).find(([, [snake]]) => snake === segment);
    if (camel !== undefined) {
      path.push(camel[0]);
      node = camel[1][1];
    } else {
      path.push(segment);
      node = node?.a;
    }
  }

  return path;
};

const describeError = (error: {
  keyword: string;
  message?: string;
  params: Record<string, unknown>;
}): string => {
  switch (error.keyword) {
    case 'additionalProperties':
      return `Unknown field "${String(error.params.additionalProperty)}"`;
    case 'enum':
      return `Must be one of: ${(error.params.allowedValues as unknown[]).map(String).join(', ')}`;
    case 'type':
      return `Must be ${String(error.params.type)}`;
    case 'required':
      return `Missing required field "${snakeToCamel(String(error.params.missingProperty))}"`;
    case 'oneOf':
    case 'anyOf':
      return 'Does not match any allowed shape';
    default:
      return error.message ?? 'Invalid value';
  }
};

/**
 * Runs a generated component through normalize → rename → validate.
 * Diagnostics use the camelCase config paths; the (possibly invalid) component is still returned.
 */
/** normalize → rename → validate; returns the converted value (diagnostics are reported through `ctx`). */
export const convertGeneratedValue = (
  entry: GeneratedEntry,
  config: unknown,
  normalizers: SharedNormalizers,
  ctx?: ContentDiagnosticContext,
): unknown => {
  const state: RenameState = { ctx, normalizers, reported: new Set() };
  // Flags carry no data: `{ value?: boolean }` is SDK sugar and never reaches the output.
  const renamed = entry.flag ? {} : rename(config, entry.map, [], state);

  if (!entry.validate(renamed)) {
    const errors = entry.validate.errors ?? [];
    const isComposite = (e: { keyword: string }) =>
      e.keyword === 'oneOf' || e.keyword === 'anyOf';
    const inBranch = (e: { schemaPath?: string }) =>
      /\/(oneOf|anyOf)\/\d+\//.test(e.schemaPath ?? '');

    // A failed oneOf/anyOf is explained by its closest branch (the one with the fewest errors).
    const expand = (
      error: (typeof errors)[number],
    ): (typeof errors)[number][] => {
      if (!isComposite(error)) {
        return [error];
      }
      const prefix = `${error.schemaPath}/`;
      const byBranch = new Map<string, (typeof errors)[number][]>();
      for (const candidate of errors) {
        if (candidate !== error && candidate.schemaPath?.startsWith(prefix)) {
          const branch = candidate.schemaPath
            .slice(prefix.length)
            .split('/')[0];
          byBranch.set(branch, [...(byBranch.get(branch) ?? []), candidate]);
        }
      }
      const best = [...byBranch.values()]
        .filter(
          (list) =>
            !list.every(
              (e) =>
                e.keyword === 'type' && e.instancePath === error.instancePath,
            ),
        )
        .sort((a, b) => a.length - b.length)[0];

      return best === undefined ? [error] : best.flatMap(expand);
    };

    const shown = errors
      .filter((error) => !inBranch(error))
      .flatMap(expand)
      .filter(
        (error) =>
          !(
            error.keyword === 'additionalProperties' &&
            state.reported.has(
              `${error.instancePath}/${String(error.params.additionalProperty)}`,
            )
          ),
      );
    const seen = new Set<string>();
    for (const error of shown) {
      const path = toCamelPath(error.instancePath, entry.map);
      const message = describeError(error);
      const id = `${formatPath(path)}|${message}`;
      if (seen.has(id)) {
        continue;
      }
      seen.add(id);
      report(state, path, message);
    }
  }

  if (entry.freeForm !== undefined && isPlainObject(renamed)) {
    for (const key of Object.keys(renamed)) {
      if (/^[a-z]+[A-Z]/.test(key)) {
        report(
          state,
          [key],
          `free-form component, keys are written as is: "${key}" looks camelCase but Minecraft keys are snake_case`,
          'warning',
        );
      }
    }
  }

  return renamed;
};

export const convertGenerated = (
  entry: GeneratedEntry,
  config: unknown,
  normalizers: SharedNormalizers,
  ctx?: ContentDiagnosticContext,
): Record<string, unknown> | undefined => {
  if (entry.removed !== undefined) {
    const { since, replacement } = entry.removed;
    const message = `${entry.key} is not in the Bedrock schemas since ${since}${
      replacement?.length ? ` — use ${replacement.join(' / ')}` : ''
    }`;
    if (
      ctx?.formatVersion !== undefined &&
      isVersionAtLeast(ctx.formatVersion, since)
    ) {
      // Minecraft refuses the whole file when it finds a component that is not in the schema.
      logContentError(
        ctx,
        `${message}; it is not written (the file would fail to load)`,
      );

      return undefined;
    }
    logContentWarning(
      ctx,
      `${message}; format versions ${since} and newer reject it`,
    );
  }
  if (entry.deprecated) {
    logContentWarning(
      ctx,
      typeof entry.deprecated === 'string'
        ? `${entry.key} is deprecated: ${entry.deprecated}`
        : `${entry.key} is not part of the Bedrock schemas (removed or unknown upstream) and may be ignored by the game`,
    );
  }
  if (entry.flag) {
    // Schemas that accept `boolean | {}` keep a bare boolean as written.
    if (typeof config === 'boolean' && entry.flag === 'boolean') {
      return { [entry.key]: config };
    }
    if (config === false || (isPlainObject(config) && config.value === false)) {
      return undefined;
    }
    if (config === true || config === undefined) {
      return { [entry.key]: {} };
    }
  }
  return {
    [entry.key]: convertGeneratedValue(entry, config, normalizers, ctx),
  };
};

/** SDK sugar on top of a generated component (kept small and explicit). */
export interface ComponentOverride {
  /** Rewrites the SDK config into the schema-shaped config; `undefined` skips the component. */
  pre?: (config: any, ctx?: ContentDiagnosticContext) => unknown;
  /** Replaces the whole conversion (the generated one is available as `generic`). */
  build?: (
    config: any,
    ctx: ContentDiagnosticContext | undefined,
    generic: (config: unknown) => Record<string, unknown> | undefined,
  ) => Record<string, unknown> | undefined;
}

/** Normalizers for areas without filters/triggers (items, blocks). */
export const passthroughNormalizers: SharedNormalizers = {
  filters: (value) => value,
  trigger: (value) => value,
};

export const convertWithOverride = (
  entry: GeneratedEntry,
  config: unknown,
  normalizers: SharedNormalizers,
  ctx?: ContentDiagnosticContext,
  override?: ComponentOverride,
): Record<string, unknown> | undefined => {
  const generic = (value: unknown) =>
    convertGenerated(entry, value, normalizers, ctx);
  if (override?.build !== undefined) {
    return override.build(config, ctx, generic);
  }
  if (override?.pre !== undefined) {
    const prepared = override.pre(config, ctx);

    return prepared === undefined ? undefined : generic(prepared);
  }

  return generic(config);
};

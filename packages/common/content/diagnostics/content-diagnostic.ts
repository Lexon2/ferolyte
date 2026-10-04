export type ContentType =
  | 'item'
  | 'block'
  | 'server-entity'
  | 'client-entity'
  | 'attachable'
  | 'render-controller'
  | 'recipe'
  | 'spawn-rule'
  | 'animation-controller-bp'
  | 'animation-controller-rp';

export type ContentSection =
  | 'components'
  | 'states'
  | 'traits'
  | 'permutations'
  | 'menuCategory'
  | 'behaviors'
  | 'events'
  | 'filters';

export interface ContentDiagnosticContext {
  sourceFile?: string;
  identifier?: string;
  component?: string;
  fieldPath?: string;
  section?: ContentSection;
  debug?: boolean;
  diagnostics?: boolean;
  contentType?: ContentType;
  /** Profile `minGameVersion`, used to pick default format versions. */
  minGameVersion?: string;
  /** Format version of the file being built (config `version`, else the profile `minGameVersion`). */
  formatVersion?: string;
  /** `format_version` that is written to the file (config `version`, else the content type default); not the profile `minGameVersion`. */
  outputVersion?: string;
}

export const buildFieldPath = (ctx: ContentDiagnosticContext): string => {
  const parts: string[] = [];
  const section = ctx.section ?? (ctx.component !== undefined ? 'components' : undefined);

  switch (section) {
    case 'components':
      if (ctx.component !== undefined) {
        parts.push('components', ctx.component);
      }
      break;
    case 'states':
      parts.push('states');
      break;
    case 'traits':
      parts.push('traits');
      break;
    case 'permutations':
      parts.push('permutations');
      break;
    case 'menuCategory':
      parts.push('menuCategory');
      break;
    case 'behaviors':
      parts.push('components', 'behaviors');
      break;
    case 'events':
      parts.push('events');
      break;
    case 'filters':
      parts.push('filters');
      break;
    default:
      if (ctx.component !== undefined) {
        parts.push('components', ctx.component);
      }
      break;
  }

  if (ctx.fieldPath !== undefined && ctx.fieldPath.length > 0) {
    if (ctx.fieldPath.startsWith('[')) {
      return `${parts.join('.')}${ctx.fieldPath}`;
    }

    parts.push(ctx.fieldPath);
  }

  if (parts.length === 0) {
    return '(unknown)';
  }

  return parts.join('.');
};

export type ContentDiagnosticSeverity = 'error' | 'warning';

/** Machine-readable form of a content diagnostic (`ferolyte check`, `run --json`). */
export interface ContentDiagnosticRecord {
  file: string;
  contentType: string;
  component: string;
  fieldPath: string;
  message: string;
  severity: ContentDiagnosticSeverity;
}

type ContentDiagnosticSink = (record: ContentDiagnosticRecord) => void;

/**
 * Content is bundled and evaluated in memory, so this module is instantiated
 * more than once (compiler + user bundle). The sink therefore lives on `globalThis`.
 */
interface DiagnosticSinkState {
  sink?: ContentDiagnosticSink;
  silent: boolean;
}

const SINK_KEY = Symbol.for('ferolyte.contentDiagnosticSink');

const sinkState = (): DiagnosticSinkState => {
  const holder = globalThis as unknown as Record<symbol, DiagnosticSinkState>;

  return (holder[SINK_KEY] ??= { silent: false });
};

/**
 * Collects diagnostics as records. With `silent` the human-readable console
 * output is suppressed. Pass `undefined` to detach.
 */
export const setContentDiagnosticSink = (
  sink: ContentDiagnosticSink | undefined,
  options: { silent?: boolean } = {},
): void => {
  const state = sinkState();
  state.sink = sink;
  state.silent = sink !== undefined && options.silent === true;
};

/** Reports a failure that has no builder context (bundle/evaluation errors). */
export const reportContentFailure = (file: string, message: string): void => {
  sinkState().sink?.({
    file,
    contentType: 'unknown',
    component: '',
    fieldPath: '',
    message: message.trim(),
    severity: 'error',
  });
};

const emitRecord = (
  ctx: ContentDiagnosticContext | undefined,
  message: string,
  severity: ContentDiagnosticSeverity,
): void => {
  sinkState().sink?.({
    file: ctx?.sourceFile ?? '',
    contentType: ctx?.contentType ?? 'item',
    component: ctx?.component ?? '',
    fieldPath: ctx !== undefined ? buildFieldPath(ctx) : '(unknown)',
    message,
    severity,
  });
};

export const createFileLink = (filePath?: string): string => {
  if (filePath === undefined || filePath.length === 0) {
    return '(unknown)';
  }

  return `\u001b]8;;file:///${filePath.replace(/\\/g, '/')}\u0007${filePath}\u001b]8;;\u0007`;
};

const contentTypeLabels: Record<ContentType, string> = {
  item: 'Item',
  block: 'Block',
  'server-entity': 'Server entity',
  'client-entity': 'Client entity',
  attachable: 'Attachable',
  'render-controller': 'Render controller',
  recipe: 'Recipe',
  'spawn-rule': 'Spawn rule',
  'animation-controller-bp': 'BP animation controller',
  'animation-controller-rp': 'RP animation controller',
};

export const logContentError = (
  ctx: ContentDiagnosticContext | undefined,
  reason: string,
): void => {
  if (ctx?.diagnostics === false) {
    return;
  }

  emitRecord(ctx, reason, 'error');
  if (sinkState().silent) {
    return;
  }

  const contentType = ctx?.contentType ?? 'item';
  const label = contentTypeLabels[contentType];
  const field = ctx !== undefined ? buildFieldPath(ctx) : '(unknown)';
  const file = createFileLink(ctx?.sourceFile);

  console.error(
    `\n🛑 ${label} validation error\n   File: ${file}\n   Field: ${field}\n   Reason: ${reason}\n`,
  );
};

export const logContentWarning = (
  ctx: ContentDiagnosticContext | undefined,
  reason: string,
): void => {
  if (ctx?.diagnostics === false) {
    return;
  }

  emitRecord(ctx, reason, 'warning');
  if (sinkState().silent) {
    return;
  }

  const contentType = ctx?.contentType ?? 'item';
  const label = contentTypeLabels[contentType];
  const field = ctx !== undefined ? buildFieldPath(ctx) : '(unknown)';
  const file = createFileLink(ctx?.sourceFile);

  console.warn(
    `
⚠️ ${label} validation warning
   File: ${file}
   Field: ${field}
   Reason: ${reason}
`,
  );
};

export const withFieldPath = (
  ctx: ContentDiagnosticContext | undefined,
  fieldPath: string,
): ContentDiagnosticContext | undefined => {
  if (ctx === undefined) {
    return undefined;
  }

  return {
    ...ctx,
    fieldPath:
      ctx.fieldPath !== undefined && ctx.fieldPath.length > 0
        ? `${ctx.fieldPath}.${fieldPath}`
        : fieldPath,
  };
};

export const withComponentContext = (
  ctx: ContentDiagnosticContext | undefined,
  component: string,
): ContentDiagnosticContext | undefined => {
  if (ctx === undefined) {
    return { component, section: 'components', contentType: 'item' };
  }

  return { ...ctx, component, section: 'components', fieldPath: undefined };
};

export const withSectionContext = (
  ctx: ContentDiagnosticContext | undefined,
  section: ContentSection,
  fieldPath?: string,
): ContentDiagnosticContext | undefined => {
  if (ctx === undefined) {
    return fieldPath !== undefined
      ? { section, fieldPath, contentType: 'block' }
      : { section, contentType: 'block' };
  }

  return {
    ...ctx,
    section,
    component: section === 'components' ? ctx.component : undefined,
    fieldPath,
  };
};

/** Reports a ready-made record (diagnostics that do not come from a builder, e.g. TypeScript errors). */
export const reportDiagnosticRecord = (record: ContentDiagnosticRecord): void => {
  sinkState().sink?.(record);
};

/** Currently attached sink (used to chain collectors). */
export const getContentDiagnosticSink = (): {
  sink?: (record: ContentDiagnosticRecord) => void;
  silent: boolean;
} => ({ ...sinkState() });

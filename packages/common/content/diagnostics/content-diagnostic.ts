export type ContentType = 'item' | 'block' | 'server-entity' | 'client-entity';

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
};

export const logContentError = (
  ctx: ContentDiagnosticContext | undefined,
  reason: string,
): void => {
  if (ctx?.diagnostics === false) {
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

export type ContentType = 'item' | 'block' | 'server-entity' | 'client-entity';

export interface ContentDiagnosticContext {
  sourceFile?: string;
  identifier?: string;
  component?: string;
  fieldPath?: string;
  debug?: boolean;
  contentType?: ContentType;
}

export const buildFieldPath = (ctx: ContentDiagnosticContext): string => {
  const parts: string[] = [];

  if (ctx.component !== undefined) {
    parts.push('components', ctx.component);
  }

  if (ctx.fieldPath !== undefined && ctx.fieldPath.length > 0) {
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
  if (ctx?.debug === false) {
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
    return { component, contentType: 'item' };
  }

  return { ...ctx, component, fieldPath: undefined };
};

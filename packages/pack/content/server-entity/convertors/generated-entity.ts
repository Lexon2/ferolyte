import {
  ContentDiagnosticContext,
  withFieldPath,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import type { GeneratedEntry } from '../../generated/key-map';
import {
  SharedNormalizers,
  convertGenerated,
} from '../../generated/runtime';
import { convertEntityFilters } from './common/filters.convertor';
import { convertTrigger } from './common/trigger.convertor';

const normalizeTrigger = (
  value: unknown,
  ctx?: ContentDiagnosticContext,
): unknown => {
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item, index) =>
      normalizeTrigger(item, withFieldPath(ctx, `[${index}]`)),
    );
  }

  return convertTrigger(value as never, ctx);
};

/** Shared types of entity schemas that are normalized by the existing hand-written convertors. */
export const entityNormalizers: SharedNormalizers = {
  filters: (value, ctx) => convertEntityFilters(value as never, ctx),
  trigger: normalizeTrigger,
};

/** Converts one entity component or behavior with the schema-generated runtime. */
export const convertGeneratedEntity = (
  entry: GeneratedEntry,
  config: unknown,
  ctx?: ContentDiagnosticContext,
): Record<string, unknown> | undefined =>
  convertGenerated(entry, config, entityNormalizers, ctx);

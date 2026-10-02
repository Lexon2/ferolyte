import {
  ContentDiagnosticContext,
  logContentError,
  withFieldPath,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { filterRegistry } from '../../../generated/filters/registry';
import { convertGeneratedValue } from '../../../generated/runtime';
import { EntityFilters } from '../../interfaces/filters';

const GROUPS = [
  ['allOf', 'all_of'],
  ['anyOf', 'any_of'],
  ['noneOf', 'none_of'],
] as const;

/** Legacy (pre-1.8) group spellings of vanilla files: copied as written. */
const LEGACY_GROUPS = ['AND', 'OR'] as const;

const resolveFilterContext = (
  ctx: ContentDiagnosticContext | undefined,
): ContentDiagnosticContext =>
  ctx ?? { section: 'filters', contentType: 'server-entity' };

const normalizers = {
  filters: (value: unknown, ctx?: ContentDiagnosticContext) =>
    convertEntityFilters(value as never, ctx),
  trigger: (value: unknown) => value,
};

/**
 * Converts filters to Minecraft format: a list is an implicit `all_of`, groups
 * are `allOf`/`anyOf`/`noneOf`, a test is validated by its generated schema.
 * @returns The filters in Minecraft format or undefined when nothing valid remains
 */
export const convertEntityFilters = (
  filters?: Partial<EntityFilters>,
  ctx?: ContentDiagnosticContext,
): any | undefined => {
  if (!filters) {
    return undefined;
  }

  const filterCtx = resolveFilterContext(ctx);
  const input = filters as Record<string, unknown>;

  if (Array.isArray(filters)) {
    return {
      all_of: (filters as unknown[])
        .map((filter, index) =>
          convertEntityFilters(
            filter as never,
            withFieldPath(filterCtx, `[${index}]`),
          ),
        )
        .filter(Boolean),
    };
  }

  let result: Record<string, unknown> = {};

  if (typeof input.test === 'string') {
    const entry = filterRegistry[input.test];
    if (entry === undefined) {
      logContentError(
        withFieldPath(filterCtx, 'test'),
        `Unknown filter test: ${input.test}`,
      );

      return undefined;
    }
    const { allOf, anyOf, noneOf, ...leaf } = input;
    const { test, ...properties } = leaf;
    result = {
      test,
      ...(convertGeneratedValue(
        entry,
        properties,
        normalizers,
        filterCtx,
      ) as Record<string, unknown>),
    };
  }

  for (const [camel, snake] of GROUPS) {
    const group = input[camel];
    if (Array.isArray(group)) {
      result[snake] = group.map((filter, index) =>
        convertEntityFilters(
          filter,
          withFieldPath(filterCtx, `${camel}[${index}]`),
        ),
      );
    }
  }
  for (const legacy of LEGACY_GROUPS) {
    if (input[legacy] !== undefined) {
      result[legacy] = input[legacy];
    }
  }

  return result;
};

import {
  ContentDiagnosticContext,
  logContentError,
  withFieldPath,
} from '@artifex/common/content/diagnostics/content-diagnostic';
import { EntityFilters } from '../../interfaces/filters';
import { entityFilterConvertorsFactory } from '../filter-convertors.factory';

const resolveFilterContext = (
  ctx: ContentDiagnosticContext | undefined,
): ContentDiagnosticContext => {
  if (ctx !== undefined) {
    return ctx;
  }

  return { section: 'filters', contentType: 'server-entity' };
};

/**
 * Converts Filters to Minecraft format
 * @param filters The filters to convert
 * @returns The filters in Minecraft format or undefined if validation fails
 */
export const convertEntityFilters = (
  filters?: Partial<EntityFilters>,
  ctx?: ContentDiagnosticContext,
): any | undefined => {
  if (!filters) {
    return undefined;
  }

  const filterCtx = resolveFilterContext(ctx);
  let result: any = {};

  if (Array.isArray(filters)) {
    result.all_of = filters
      .map((filter, index) =>
        convertEntityFilters(
          filter,
          withFieldPath(filterCtx, `[${index}]`),
        ),
      )
      .filter(Boolean);
  } else if ('test' in filters && filters.test) {
    const convertor = entityFilterConvertorsFactory[filters.test];
    if (convertor) {
      const converted = convertor(filters, filterCtx);
      if (converted) {
        result = { test: filters.test, ...converted };
      }
    } else {
      logContentError(
        withFieldPath(filterCtx, 'test'),
        `Unknown filter test: ${String(filters.test)}`,
      );
    }
  } else if ('allOf' in filters && Array.isArray(filters.allOf)) {
    result.all_of = filters.allOf.map((filter, index) =>
      convertEntityFilters(
        filter,
        withFieldPath(filterCtx, `allOf[${index}]`),
      ),
    );
  } else if ('anyOf' in filters && Array.isArray(filters.anyOf)) {
    result.any_of = filters.anyOf.map((filter, index) =>
      convertEntityFilters(
        filter,
        withFieldPath(filterCtx, `anyOf[${index}]`),
      ),
    );
  } else if ('noneOf' in filters && Array.isArray(filters.noneOf)) {
    result.none_of = filters.noneOf.map((filter, index) =>
      convertEntityFilters(
        filter,
        withFieldPath(filterCtx, `noneOf[${index}]`),
      ),
    );
  }

  return result;
};

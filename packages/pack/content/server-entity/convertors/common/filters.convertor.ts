import { EntityFilters } from '../../interfaces/filters';
import { entityFilterConvertorsFactory } from '../filter-convertors.factory';

/**
 * Converts Filters to Minecraft format
 * @param filters The filters to convert
 * @returns The filters in Minecraft format or undefined if validation fails
 */
export const convertEntityFilters = (
  filters?: Partial<EntityFilters>,
): any | undefined => {
  if (!filters) {
    return undefined;
  }

  let result: any = {};

  if (Array.isArray(filters)) {
    result.all_of = filters.map((f) => convertEntityFilters(f)).filter(Boolean);
  } else if ('test' in filters && filters.test) {
    const convertor = entityFilterConvertorsFactory[filters.test];
    if (convertor) {
      const converted = convertor(filters);
      if (converted) {
        result = { test: filters.test, ...converted };
      }
    }
  } else if ('allOf' in filters && Array.isArray(filters.allOf)) {
    result.all_of = filters.allOf.map(convertEntityFilters);
  } else if ('anyOf' in filters && Array.isArray(filters.anyOf)) {
    result.any_of = filters.anyOf.map(convertEntityFilters);
  } else if ('noneOf' in filters && Array.isArray(filters.noneOf)) {
    result.none_of = filters.noneOf.map(convertEntityFilters);
  }

  return result;
};

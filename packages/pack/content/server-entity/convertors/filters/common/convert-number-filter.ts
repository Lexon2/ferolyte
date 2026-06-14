import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { convertFilterBase } from './convert-filter-base';
import { FilterOperator } from '../../../constants/filter-operators';
import { FilterSubject } from '../../../constants/filter-subjects';
import { validateNumber } from '../../common/validation';

// @TODO: Add min max check
/**
 * Converts a number filter to a Minecraft JSON filter
 * @param filter The filter to convert
 * @returns The converted filter or undefined if validation fails
 */

export const convertNumberFilter = (
  filter: {
  test: string;
  operator?: FilterOperator;
  subject?: FilterSubject;
  value?: number;
},
  ctx?: ContentDiagnosticContext
): any | undefined => {
  if (!filter) {
    return undefined;
  }
  const result: any = convertFilterBase(filter, ctx);
  if (!result) {
    return undefined;
  }

  if (filter.value === undefined || !validateNumber(filter.value, 'value', undefined, undefined, ctx)) {
    return undefined;
  }

  result.test = filter.test;
  result.value = filter.value;

  return result;
};

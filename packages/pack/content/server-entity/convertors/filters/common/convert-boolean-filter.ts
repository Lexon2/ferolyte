import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { convertFilterBase } from './convert-filter-base';
import { FilterOperator } from '../../../constants/filter-operators';
import { FilterSubject } from '../../../constants/filter-subjects';
import { validateBoolean } from '../../common/validation';

/**
 * Common function for converting boolean filters
 * @param filter The filter to convert
 * @param test The test name in snake_case
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertBooleanFilter = (
  filter: {
  test: string;
  value?: boolean;
  operator?: FilterOperator;
  subject?: FilterSubject;
},
  ctx?: ContentDiagnosticContext
):
  | {
      test: string;
      operator?: FilterOperator;
      subject?: FilterSubject;
      value?: boolean;
    }
  | undefined => {
  if (!filter) {
    return undefined;
  }

  const result: any = convertFilterBase(filter, ctx);
  if (!result) {
    return undefined;
  }
  // Validate value property
  if (filter.value !== undefined) {
    if (!validateBoolean(filter.value, 'value', ctx)) {
      return undefined;
    }
    result.value = filter.value;
  }

  result.test = filter.test;

  return result;
};

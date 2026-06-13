import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { convertFilterBase } from './convert-filter-base';
import { FilterOperator } from '../../../constants/filter-operators';
import { FilterSubject } from '../../../constants/filter-subjects';
import { validateString } from '../../common/validation';

export const convertStringNumberFilter = (
  filter: {
  test: string;
  operator?: FilterOperator;
  subject?: FilterSubject;
  value?: string | number;
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

  if (filter.value === undefined || !validateString(filter.value, 'value', ctx)) {
    return undefined;
  }

  result.test = filter.test;
  result.value = filter.value;

  return result;
};

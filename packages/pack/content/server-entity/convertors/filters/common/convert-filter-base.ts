import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import {
  FILTER_OPERATORS,
  FilterOperator,
} from '../../../constants/filter-operators';
import {
  FILTER_SUBJECTS,
  FilterSubject,
} from '../../../constants/filter-subjects';
import { validateAllowedValues } from '../../common/validation';

export const convertFilterBase = (
  filter: {
  operator?: FilterOperator;
  subject?: FilterSubject;
},
  ctx?: ContentDiagnosticContext
): { operator?: FilterOperator; subject?: FilterSubject } | undefined => {
  const result: any = {};

  // Validate optional properties
  if (filter.operator !== undefined) {
    if (!validateAllowedValues(filter.operator, FILTER_OPERATORS, 'operator', ctx)) {
      return undefined;
    }

    result.operator = filter.operator;
  }

  if (filter.subject !== undefined) {
    if (!validateAllowedValues(filter.subject, FILTER_SUBJECTS, 'subject', ctx)) {
      return undefined;
    }

    result.subject = filter.subject;
  }

  return result;
};

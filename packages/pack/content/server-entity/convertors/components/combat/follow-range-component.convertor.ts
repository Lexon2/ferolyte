import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { FollowRangeComponent } from '../../../interfaces/components/combat/follow-range-component';
import { validateNumber } from '../../common/validation';

export const convertFollowRangeComponent = (
  component: FollowRangeComponent,
  ctx?: ContentDiagnosticContext,
): any => {
  if (component.value === undefined) {
    return undefined;
  }

  const result: any = {};

  if (component.value !== undefined) {
    if (!validateNumber(component.value, 'value')) {
      return undefined;
    }

    result.value = component.value;
  }

  if (component.max !== undefined) {
    if (!validateNumber(component.max, 'max')) {
      return undefined;
    }

    result.max = component.max;
  }

  return {
    'minecraft:follow_range': result,
  };
};

import { withFieldPath, ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { MobEffectComponent } from '../../../interfaces/components/ai/mob-effect-component';
import { convertEntityFilters } from '../../common/filters.convertor';
import { validateNumber } from '../../common/validation';

/**
 * Converts a MobEffectComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertMobEffectComponent = (
  component: Partial<MobEffectComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:mob_effect': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate effectRange
  if (component.effectRange !== undefined) {
    if (!validateNumber(component.effectRange, 'effectRange', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.effect_range = component.effectRange;
  }

  // Validate effectTime
  if (component.effectTime !== undefined) {
    if (!validateNumber(component.effectTime, 'effectTime', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.effect_time = component.effectTime;
  }

  // Validate entityFilter
  if (component.entityFilter !== undefined) {
    const convertedEntityFilter = convertEntityFilters(component.entityFilter, withFieldPath(ctx, 'entityFilter'));
    if (!convertedEntityFilter) {
      return undefined;
    }
    result.entity_filter = convertedEntityFilter;
  }

  return {
    'minecraft:mob_effect': result,
  };
};

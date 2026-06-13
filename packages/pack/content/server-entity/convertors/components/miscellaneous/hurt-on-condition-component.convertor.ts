import { withFieldPath, ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import {
  HurtOnConditionComponent,
  HurtOnConditionDamageCondition,
} from '../../../interfaces/components/miscellaneous/hurt-on-condition-component';
import { convertEntityFilters } from '../../common/filters.convertor';
import {
  validateDamageSourceType,
  validateNumber,
} from '../../common/validation';

/**
 * Validates a damage condition
 * @param condition The condition to validate
 * @param fieldName The name of the field for error messages
 * @returns Whether the condition is valid
 */
const validateDamageCondition = (
  condition: HurtOnConditionDamageCondition,
  ctx?: ContentDiagnosticContext,
): any | undefined => {
  if (!condition) {
    return undefined;
  }

  const result: any = {};

  // Validate filters
  if (condition.filters !== undefined) {
    const convertedFilters = convertEntityFilters(condition.filters, withFieldPath(ctx, 'filters'));
    if (!convertedFilters) {
      return undefined;
    }
    result.filters = convertedFilters;
  }

  // Validate cause
  if (condition.cause !== undefined) {
    if (!validateDamageSourceType(condition.cause, 'cause')) {
      return undefined;
    }
    result.cause = condition.cause;
  }

  // Validate damagePerTick
  if (condition.damagePerTick !== undefined) {
    if (
      !validateNumber(
        condition.damagePerTick,
        'damagePerTick',
        0,
        Number.MAX_VALUE,
      )
    ) {
      return undefined;
    }
    result.damage_per_tick = condition.damagePerTick;
  }

  return result;
};

/**
 * Converts a HurtOnConditionComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertHurtOnConditionComponent = (
  component: Partial<HurtOnConditionComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:hurt_on_condition': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate damageConditions
  if (component.damageConditions !== undefined) {
    if (!Array.isArray(component.damageConditions)) {
      console.error('damageConditions must be an array');

      return undefined;
    }

    const validatedConditions = component.damageConditions.map(
      (condition, index) => {
        const converted = validateDamageCondition(
          condition,
          withFieldPath(ctx, `damageConditions[${index}]`),
        );
        if (!converted) {
          return undefined;
        }

        return converted;
      },
    );

    if (validatedConditions.includes(undefined)) {
      return undefined;
    }

    result.damage_conditions = validatedConditions;
  }

  return {
    'minecraft:hurt_on_condition': result,
  };
};

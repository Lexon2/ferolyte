import {
  withFieldPath,
  ContentDiagnosticContext,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { AreaAttackComponent } from '../../../interfaces/components/combat/area-attack-component';
import { convertEntityFilters } from '../../common/filters.convertor';
import {
  validateNumber,
  validateString,
  validateBoolean,
} from '../../common/validation';

/**
 * Converts an AreaAttackComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertAreaAttackComponent = (
  component: Partial<AreaAttackComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:area_attack': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate cause
  if (component.cause !== undefined) {
    if (!validateString(component.cause, 'cause')) {
      return undefined;
    }
    result.cause = component.cause;
  }

  // Validate damageCooldown
  if (component.damageCooldown !== undefined) {
    if (
      !validateNumber(
        component.damageCooldown,
        'damageCooldown',
        0,
        Number.MAX_VALUE,
      )
    ) {
      return undefined;
    }
    result.damage_cooldown = component.damageCooldown;
  }

  // Validate damagePerTick
  if (component.damagePerTick !== undefined) {
    if (
      !validateNumber(
        component.damagePerTick,
        'damagePerTick',
        0,
        Number.MAX_VALUE,
      )
    ) {
      return undefined;
    }
    result.damage_per_tick = component.damagePerTick;
  }

  // Validate damageRange
  if (component.damageRange !== undefined) {
    if (
      !validateNumber(component.damageRange, 'damageRange', 0, Number.MAX_VALUE)
    ) {
      return undefined;
    }
    result.damage_range = component.damageRange;
  }

  // Validate entityFilter
  if (component.entityFilter !== undefined) {
    const convertedEntityFilter = convertEntityFilters(
      component.entityFilter,
      withFieldPath(ctx, 'entityFilter'),
    );
    if (!convertedEntityFilter) {
      return undefined;
    }
    result.entity_filter = convertedEntityFilter;
  }

  // Validate playAttackSound
  if (component.playAttackSound !== undefined) {
    if (!validateBoolean(component.playAttackSound, 'playAttackSound')) {
      return undefined;
    }
    result.play_attack_sound = component.playAttackSound;
  }

  return {
    'minecraft:area_attack': result,
  };
};

import {
  ContentDiagnosticContext,
  withFieldPath,
} from '@artifex/pack/common/diagnostics/content-diagnostic';
import {
  DamageSensorComponent,
  DamageTrigger,
} from '../../../interfaces/components/sensors/damage-sensor-component';
import { convertTrigger } from '../../common/trigger.convertor';
import {
  validateAllowedValues,
  validateNumber,
  validateDamageSourceType,
  validateSoundEvent,
} from '../../common/validation';

const DEALS_DAMAGE_VALUES = ['yes', 'no', 'no_but_side_effects_apply'] as const;

const convertDamageTrigger = (
  trigger: DamageTrigger,
  ctx?: ContentDiagnosticContext,
) => {
  const result: any = {};

  if (trigger.cause !== undefined) {
    if (!validateDamageSourceType(trigger.cause, 'cause', ctx)) {
      return undefined;
    }
    result.cause = trigger.cause;
  }

  if (trigger.damageModifier !== undefined) {
    if (!validateNumber(trigger.damageModifier, 'damageModifier', undefined, undefined, ctx)) {
      return undefined;
    }
    result.damage_modifier = trigger.damageModifier;
  }

  if (trigger.damageMultiplier !== undefined) {
    if (!validateNumber(trigger.damageMultiplier, 'damageMultiplier', undefined, undefined, ctx)) {
      return undefined;
    }
    result.damage_multiplier = trigger.damageMultiplier;
  }

  if (trigger.dealsDamage !== undefined) {
    if (
      !validateAllowedValues(
        trigger.dealsDamage,
        DEALS_DAMAGE_VALUES,
        'dealsDamage',
        ctx,
      )
    ) {
      return undefined;
    }
    result.deals_damage = trigger.dealsDamage;
  }

  if (trigger.onDamage !== undefined) {
    const convertedOnDamage = convertTrigger(
      trigger.onDamage,
      withFieldPath(ctx, 'onDamage'),
    );
    if (!convertedOnDamage) {
      return undefined;
    }
    result.on_damage = convertedOnDamage;
  }

  if (trigger.onDamageSoundEvent !== undefined) {
    if (!validateSoundEvent(trigger.onDamageSoundEvent, 'onDamageSoundEvent', ctx)) {
      return undefined;
    }
    result.on_damage_sound_event = trigger.onDamageSoundEvent;
  }

  return result;
};

/**
 * Converts a DamageSensorComponent to Minecraft format
 * @param component The component to convert
 * @returns The converted component in Minecraft format or undefined if validation fails
 */
export const convertDamageSensorComponent = (
  component: Partial<DamageSensorComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:damage_sensor': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  if (component.triggers) {
    const triggers = component.triggers
      .map((trigger, index) =>
        convertDamageTrigger(trigger, withFieldPath(ctx, `triggers[${index}]`)),
      )
      .filter(Boolean);

    if (triggers.length > 0) {
      result.triggers = triggers;
    }
  }

  return {
    'minecraft:damage_sensor': result,
  };
};

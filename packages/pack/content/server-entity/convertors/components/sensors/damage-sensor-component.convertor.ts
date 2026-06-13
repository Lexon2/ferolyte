import {
  DamageSensorComponent,
  DamageTrigger,
} from '../../../interfaces/components/sensors/damage-sensor-component';
import { convertTrigger } from '../../common/trigger.convertor';
import {
  validateNumber,
  validateDamageSourceType,
  validateSoundEvent,
} from '../../common/validation';

const convertDamageTrigger = (trigger: DamageTrigger) => {
  const result: any = {};

  if (trigger.cause !== undefined) {
    if (!validateDamageSourceType(trigger.cause, 'cause')) {
      return undefined;
    }
    result.cause = trigger.cause;
  }

  if (trigger.damageModifier !== undefined) {
    if (!validateNumber(trigger.damageModifier, 'damage_modifier')) {
      return undefined;
    }
    result.damage_modifier = trigger.damageModifier;
  }

  if (trigger.damageMultiplier !== undefined) {
    if (!validateNumber(trigger.damageMultiplier, 'damage_multiplier')) {
      return undefined;
    }
    result.damage_multiplier = trigger.damageMultiplier;
  }

  if (trigger.dealsDamage !== undefined) {
    if (
      !['yes', 'no', 'no_but_side_effects_apply'].includes(trigger.dealsDamage)
    ) {
      console.error(
        'deals_damage must be one of: yes, no, no_but_side_effects_apply',
      );

      return undefined;
    }
    result.deals_damage = trigger.dealsDamage;
  }

  if (trigger.onDamage !== undefined) {
    const convertedOnDamage = convertTrigger(trigger.onDamage);
    if (!convertedOnDamage) {
      return undefined;
    }
    result.on_damage = convertedOnDamage;
  }

  if (trigger.onDamageSoundEvent !== undefined) {
    if (
      !validateSoundEvent(trigger.onDamageSoundEvent, 'on_damage_sound_event')
    ) {
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
): { 'minecraft:damage_sensor': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  if (component.triggers) {
    const triggers = component.triggers
      .map(convertDamageTrigger)
      .filter(Boolean);

    if (triggers.length > 0) {
      result.triggers = triggers;
    }
  }

  return {
    'minecraft:damage_sensor': result,
  };
};

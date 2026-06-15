import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { PanicBehavior } from '../../interfaces/behaviors/panic-behavior';
import { convertRange } from '../common/convertors';
import {
  validateNumber,
  validateBoolean,
  validateSoundEvent,
} from '../common/validation';
import { validateDamageSourceType } from '../common/validation';

/**
 * Converts a PanicBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertPanicBehavior = (
  behavior: Partial<PanicBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.panic': any } | undefined => {
  if (!behavior) {
    return undefined;
  }

  const result: any = {};

  // Validate priority
  if (behavior.priority !== undefined) {
    if (!validateNumber(behavior.priority, 'priority')) {
      return undefined;
    }
    result.priority = behavior.priority;
  }

  // Validate damageSources
  if (behavior.damageSources !== undefined) {
    if (
      !Array.isArray(behavior.damageSources) ||
      behavior.damageSources.some(
        (source) => !validateDamageSourceType(source, 'damageSources'),
      )
    ) {
      return undefined;
    }
    result.damage_sources = behavior.damageSources;
  }

  // Validate force
  if (behavior.force !== undefined) {
    if (!validateBoolean(behavior.force, 'force')) {
      return undefined;
    }
    result.force = behavior.force;
  }

  // Validate ignoreMobDamage
  if (behavior.ignoreMobDamage !== undefined) {
    if (!validateBoolean(behavior.ignoreMobDamage, 'ignoreMobDamage')) {
      return undefined;
    }
    result.ignore_mob_damage = behavior.ignoreMobDamage;
  }

  // Validate preferWater
  if (behavior.preferWater !== undefined) {
    if (!validateBoolean(behavior.preferWater, 'preferWater')) {
      return undefined;
    }
    result.prefer_water = behavior.preferWater;
  }

  // Validate panicSound
  if (behavior.panicSound !== undefined) {
    if (!validateSoundEvent(behavior.panicSound, 'panicSound')) {
      return undefined;
    }
    result.panic_sound = behavior.panicSound;
  }

  // Validate soundInterval
  if (behavior.soundInterval !== undefined) {
    const convertedSoundInterval = convertRange(
      behavior.soundInterval,
      'soundInterval',
    );
    if (!convertedSoundInterval) {
      return undefined;
    }
    result.sound_interval = convertedSoundInterval;
  }

  return {
    'minecraft:behavior.panic': result,
  };
};

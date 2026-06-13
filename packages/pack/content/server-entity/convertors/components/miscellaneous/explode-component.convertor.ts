import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { ExplodeComponent } from '../../../interfaces/components/miscellaneous/explode-component';
import { validateNumber } from '../../common/validation';

/**
 * Validates a fuse length value
 * @param value The value to validate
 * @param fieldName The name of the field for error messages
 * @returns Whether the value is valid
 */
const validateFuseLength = (
  value: number | [number, number] | undefined,
  fieldName: string,
): boolean => {
  if (value === undefined) {
    return true;
  }

  if (typeof value === 'number') {
    return true;
  }

  if (Array.isArray(value) && value.length === 2) {
    return value.every((item) => typeof item === 'number');
  }

  console.error(`${fieldName} must be a number or array of two numbers`);

  return false;
};

/**
 * Converts an ExplodeComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertExplodeComponent = (
  component: Partial<ExplodeComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:explode': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate allowUnderwater
  if (component.allowUnderwater !== undefined) {
    if (typeof component.allowUnderwater !== 'boolean') {
      console.error('allowUnderwater must be a boolean');

      return undefined;
    }
    result.allow_underwater = component.allowUnderwater;
  }

  // Validate breaksBlocks
  if (component.breaksBlocks !== undefined) {
    if (typeof component.breaksBlocks !== 'boolean') {
      console.error('breaksBlocks must be a boolean');

      return undefined;
    }
    result.breaks_blocks = component.breaksBlocks;
  }

  // Validate causesFire
  if (component.causesFire !== undefined) {
    if (typeof component.causesFire !== 'boolean') {
      console.error('causesFire must be a boolean');

      return undefined;
    }
    result.causes_fire = component.causesFire;
  }

  // Validate damageScaling
  if (component.damageScaling !== undefined) {
    if (!validateNumber(component.damageScaling, 'damageScaling', -Number.MAX_VALUE, Number.MAX_VALUE)) {
      return undefined;
    }
    result.damage_scaling = component.damageScaling;
  }

  // Validate destroyAffectedByGriefing
  if (component.destroyAffectedByGriefing !== undefined) {
    if (typeof component.destroyAffectedByGriefing !== 'boolean') {
      console.error('destroyAffectedByGriefing must be a boolean');

      return undefined;
    }
    result.destroy_affected_by_griefing = component.destroyAffectedByGriefing;
  }

  // Validate fireAffectedByGriefing
  if (component.fireAffectedByGriefing !== undefined) {
    if (typeof component.fireAffectedByGriefing !== 'boolean') {
      console.error('fireAffectedByGriefing must be a boolean');

      return undefined;
    }
    result.fire_affected_by_griefing = component.fireAffectedByGriefing;
  }

  // Validate fuseLength
  if (component.fuseLength !== undefined) {
    if (!validateFuseLength(component.fuseLength, 'fuseLength')) {
      return undefined;
    }
    result.fuse_length = component.fuseLength;
  }

  // Validate fuseLit
  if (component.fuseLit !== undefined) {
    if (typeof component.fuseLit !== 'boolean') {
      console.error('fuseLit must be a boolean');

      return undefined;
    }
    result.fuse_lit = component.fuseLit;
  }

  // Validate knockbackScaling
  if (component.knockbackScaling !== undefined) {
    if (!validateNumber(component.knockbackScaling, 'knockbackScaling', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.knockback_scaling = component.knockbackScaling;
  }

  // Validate maxResistance
  if (component.maxResistance !== undefined) {
    if (!validateNumber(component.maxResistance, 'maxResistance', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.max_resistance = component.maxResistance;
  }

  // Validate negatesFallDamage
  if (component.negatesFallDamage !== undefined) {
    if (typeof component.negatesFallDamage !== 'boolean') {
      console.error('negatesFallDamage must be a boolean');

      return undefined;
    }
    result.negates_fall_damage = component.negatesFallDamage;
  }

  // Validate particleEffect
  if (component.particleEffect !== undefined) {
    if (typeof component.particleEffect !== 'string') {
      console.error('particleEffect must be a string');

      return undefined;
    }
    result.particle_effect = component.particleEffect;
  }

  // Validate power
  if (component.power !== undefined) {
    if (!validateNumber(component.power, 'power', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.power = component.power;
  }

  // Validate soundEffect
  if (component.soundEffect !== undefined) {
    if (typeof component.soundEffect !== 'string') {
      console.error('soundEffect must be a string');

      return undefined;
    }
    result.sound_effect = component.soundEffect;
  }

  // Validate togglesBlocks
  if (component.togglesBlocks !== undefined) {
    if (typeof component.togglesBlocks !== 'boolean') {
      console.error('togglesBlocks must be a boolean');

      return undefined;
    }
    result.toggles_blocks = component.togglesBlocks;
  }

  return {
    'minecraft:explode': result,
  };
};

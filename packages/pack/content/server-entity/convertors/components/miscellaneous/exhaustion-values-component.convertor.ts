import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { ExhaustionValuesComponent } from '../../../interfaces/components/miscellaneous/exhaustion-values-component';
import { validateNumber } from '../../common/validation';

/**
 * Converts an ExhaustionValuesComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertExhaustionValuesComponent = (
  component: Partial<ExhaustionValuesComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:exhaustion_values': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate attack
  if (component.attack !== undefined) {
    if (!validateNumber(component.attack, 'attack', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.attack = component.attack;
  }

  // Validate damage
  if (component.damage !== undefined) {
    if (!validateNumber(component.damage, 'damage', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.damage = component.damage;
  }

  // Validate heal
  if (component.heal !== undefined) {
    if (!validateNumber(component.heal, 'heal', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.heal = component.heal;
  }

  // Validate jump
  if (component.jump !== undefined) {
    if (!validateNumber(component.jump, 'jump', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.jump = component.jump;
  }

  // Validate mine
  if (component.mine !== undefined) {
    if (!validateNumber(component.mine, 'mine', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.mine = component.mine;
  }

  // Validate sprint
  if (component.sprint !== undefined) {
    if (!validateNumber(component.sprint, 'sprint', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.sprint = component.sprint;
  }

  // Validate sprintJump
  if (component.sprintJump !== undefined) {
    if (!validateNumber(component.sprintJump, 'sprintJump', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.sprint_jump = component.sprintJump;
  }

  // Validate swim
  if (component.swim !== undefined) {
    if (!validateNumber(component.swim, 'swim', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.swim = component.swim;
  }

  // Validate walk
  if (component.walk !== undefined) {
    if (!validateNumber(component.walk, 'walk', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.walk = component.walk;
  }

  return {
    'minecraft:exhaustion_values': result,
  };
};

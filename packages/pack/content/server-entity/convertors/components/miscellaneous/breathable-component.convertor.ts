import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { BreathableComponent } from '../../../interfaces/components/miscellaneous/breathable-component';
import { validateNumber, validateString } from '../../common/validation';

/**
 * Converts a BreathableComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertBreathableComponent = (
  component: Partial<BreathableComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:breathable': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate totalSupply
  if (component.totalSupply !== undefined) {
    if (
      !validateNumber(component.totalSupply, 'totalSupply', 0, Number.MAX_VALUE)
    ) {
      return undefined;
    }
    result.total_supply = component.totalSupply;
  }

  // Validate suffocateTime
  if (component.suffocateTime !== undefined) {
    if (
      !validateNumber(
        component.suffocateTime,
        'suffocateTime',
        -Number.MAX_VALUE,
        Number.MAX_VALUE,
      )
    ) {
      return undefined;
    }
    result.suffocate_time = component.suffocateTime;
  }

  // Validate inhaleTime
  if (component.inhaleTime !== undefined) {
    if (
      !validateNumber(component.inhaleTime, 'inhaleTime', 0, Number.MAX_VALUE)
    ) {
      return undefined;
    }
    result.inhale_time = component.inhaleTime;
  }

  // Validate breathesAir
  if (component.breathesAir !== undefined) {
    if (typeof component.breathesAir !== 'boolean') {
      console.error('breathesAir must be a boolean');

      return undefined;
    }
    result.breathes_air = component.breathesAir;
  }

  // Validate breathesWater
  if (component.breathesWater !== undefined) {
    if (typeof component.breathesWater !== 'boolean') {
      console.error('breathesWater must be a boolean');

      return undefined;
    }
    result.breathes_water = component.breathesWater;
  }

  // Validate breathesLava
  if (component.breathesLava !== undefined) {
    if (typeof component.breathesLava !== 'boolean') {
      console.error('breathesLava must be a boolean');

      return undefined;
    }
    result.breathes_lava = component.breathesLava;
  }

  // Validate breathesSolids
  if (component.breathesSolids !== undefined) {
    if (typeof component.breathesSolids !== 'boolean') {
      console.error('breathesSolids must be a boolean');

      return undefined;
    }
    result.breathes_solids = component.breathesSolids;
  }

  // Validate generatesBubbles
  if (component.generatesBubbles !== undefined) {
    if (typeof component.generatesBubbles !== 'boolean') {
      console.error('generatesBubbles must be a boolean');

      return undefined;
    }
    result.generates_bubbles = component.generatesBubbles;
  }

  // Validate breatheBlocks
  if (component.breatheBlocks !== undefined) {
    if (!Array.isArray(component.breatheBlocks)) {
      console.error('breatheBlocks must be an array');

      return undefined;
    }

    const validatedBlocks = component.breatheBlocks.map((block, index) => {
      if (!validateString(block, `breatheBlocks[${index}]`)) {
        return undefined;
      }
      return block;
    });

    if (validatedBlocks.includes(undefined)) {
      return undefined;
    }

    result.breathe_blocks = validatedBlocks;
  }

  // Validate nonBreatheBlocks
  if (component.nonBreatheBlocks !== undefined) {
    if (!Array.isArray(component.nonBreatheBlocks)) {
      console.error('nonBreatheBlocks must be an array');

      return undefined;
    }

    const validatedBlocks = component.nonBreatheBlocks.map((block, index) => {
      if (!validateString(block, `nonBreatheBlocks[${index}]`)) {
        return undefined;
      }
      return block;
    });

    if (validatedBlocks.includes(undefined)) {
      return undefined;
    }

    result.non_breathe_blocks = validatedBlocks;
  }

  return {
    'minecraft:breathable': result,
  };
};

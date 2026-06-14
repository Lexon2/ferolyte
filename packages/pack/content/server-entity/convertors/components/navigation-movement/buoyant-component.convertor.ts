import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { BuoyantComponent } from '../../../interfaces/components/navigation-movement/buoyant-component';
import { validateNumber, validateString } from '../../common/validation';

/**
 * Converts a BuoyantComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertBuoyantComponent = (
  component: Partial<BuoyantComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:buoyant': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate baseBuoyancy
  if (component.baseBuoyancy !== undefined) {
    if (!validateNumber(component.baseBuoyancy, 'baseBuoyancy', -Number.MAX_VALUE, Number.MAX_VALUE)) {
      return undefined;
    }
    result.base_buoyancy = component.baseBuoyancy;
  }

  // Validate applyGravity
  if (component.applyGravity !== undefined) {
    if (typeof component.applyGravity !== 'boolean') {
      console.error('applyGravity must be a boolean');

      return undefined;
    }
    result.apply_gravity = component.applyGravity;
  }

  // Validate buoyancy
  if (component.buoyancy !== undefined) {
    if (!validateNumber(component.buoyancy, 'buoyancy', -Number.MAX_VALUE, Number.MAX_VALUE)) {
      return undefined;
    }
    result.buoyancy = component.buoyancy;
  }

  // Validate bigWaveProbability
  if (component.bigWaveProbability !== undefined) {
    if (!validateNumber(component.bigWaveProbability, 'bigWaveProbability', 0, 1)) {
      return undefined;
    }
    result.big_wave_probability = component.bigWaveProbability;
  }

  // Validate bigWaveSpeed
  if (component.bigWaveSpeed !== undefined) {
    if (!validateNumber(component.bigWaveSpeed, 'bigWaveSpeed', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.big_wave_speed = component.bigWaveSpeed;
  }

  // Validate dragDownOnBuoyancyRemoved
  if (component.dragDownOnBuoyancyRemoved !== undefined) {
    if (!validateNumber(component.dragDownOnBuoyancyRemoved, 'dragDownOnBuoyancyRemoved', -Number.MAX_VALUE, Number.MAX_VALUE)) {
      return undefined;
    }
    result.drag_down_on_buoyancy_removed = component.dragDownOnBuoyancyRemoved;
  }

  // Validate liquidBlocks
  if (component.liquidBlocks !== undefined) {
    if (!Array.isArray(component.liquidBlocks)) {
      console.error('liquidBlocks must be an array');

      return undefined;
    }

    const validatedBlocks = component.liquidBlocks.map((block, index) => {
      if (!validateString(block, `liquidBlocks[${index}]`)) {
        return undefined;
      }
      return block;
    });

    if (validatedBlocks.includes(undefined)) {
      return undefined;
    }

    result.liquid_blocks = validatedBlocks;
  }

  // Validate simulateWaves
  if (component.simulateWaves !== undefined) {
    if (typeof component.simulateWaves !== 'boolean') {
      console.error('simulateWaves must be a boolean');

      return undefined;
    }
    result.simulate_waves = component.simulateWaves;
  }

  return {
    'minecraft:buoyant': result,
  };
};

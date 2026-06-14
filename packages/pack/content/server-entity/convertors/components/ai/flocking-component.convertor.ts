import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { FlockingComponent } from '../../../interfaces/components/ai/flocking-component';
import { validateNumber } from '../../common/validation';
import { validateBoolean } from '../../common/validation';

/**
 * Converts a FlockingComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertFlockingComponent = (
  component: Partial<FlockingComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:flocking': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate blockDistance
  if (component.blockDistance !== undefined) {
    if (!validateNumber(component.blockDistance, 'blockDistance', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.block_distance = component.blockDistance;
  }

  // Validate blockWeight
  if (component.blockWeight !== undefined) {
    if (!validateNumber(component.blockWeight, 'blockWeight', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.block_weight = component.blockWeight;
  }

  // Validate breachInfluence
  if (component.breachInfluence !== undefined) {
    if (!validateNumber(component.breachInfluence, 'breachInfluence', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.breach_influence = component.breachInfluence;
  }

  // Validate cohesionThreshold
  if (component.cohesionThreshold !== undefined) {
    if (!validateNumber(component.cohesionThreshold, 'cohesionThreshold', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.cohesion_threshold = component.cohesionThreshold;
  }

  // Validate cohesionWeight
  if (component.cohesionWeight !== undefined) {
    if (!validateNumber(component.cohesionWeight, 'cohesionWeight', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.cohesion_weight = component.cohesionWeight;
  }

  // Validate goalWeight
  if (component.goalWeight !== undefined) {
    if (!validateNumber(component.goalWeight, 'goalWeight', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.goal_weight = component.goalWeight;
  }

  // Validate highFlockLimit
  if (component.highFlockLimit !== undefined) {
    if (!validateNumber(component.highFlockLimit, 'highFlockLimit', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.high_flock_limit = component.highFlockLimit;
  }

  // Validate inWater
  if (component.inWater !== undefined) {
    if (!validateBoolean(component.inWater, 'inWater')) {
      return undefined;
    }
    result.in_water = component.inWater;
  }

  // Validate influenceRadius
  if (component.influenceRadius !== undefined) {
    if (!validateNumber(component.influenceRadius, 'influenceRadius', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.influence_radius = component.influenceRadius;
  }

  // Validate innnerCohesionThreshold
  if (component.innnerCohesionThreshold !== undefined) {
    if (!validateNumber(component.innnerCohesionThreshold, 'innnerCohesionThreshold', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.innner_cohesion_threshold = component.innnerCohesionThreshold;
  }

  // Validate lonerChance
  if (component.lonerChance !== undefined) {
    if (!validateNumber(component.lonerChance, 'lonerChance', 0, 1)) {
      return undefined;
    }
    result.loner_chance = component.lonerChance;
  }

  // Validate lowFlockLimit
  if (component.lowFlockLimit !== undefined) {
    if (!validateNumber(component.lowFlockLimit, 'lowFlockLimit', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.low_flock_limit = component.lowFlockLimit;
  }

  // Validate matchVariants
  if (component.matchVariants !== undefined) {
    if (!validateBoolean(component.matchVariants, 'matchVariants')) {
      return undefined;
    }
    result.match_variants = component.matchVariants;
  }

  // Validate maxHeight
  if (component.maxHeight !== undefined) {
    if (!validateNumber(component.maxHeight, 'maxHeight', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.max_height = component.maxHeight;
  }

  // Validate minHeight
  if (component.minHeight !== undefined) {
    if (!validateNumber(component.minHeight, 'minHeight', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.min_height = component.minHeight;
  }

  // Validate separationThreshold
  if (component.separationThreshold !== undefined) {
    if (!validateNumber(component.separationThreshold, 'separationThreshold', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.separation_threshold = component.separationThreshold;
  }

  // Validate separationWeight
  if (component.separationWeight !== undefined) {
    if (!validateNumber(component.separationWeight, 'separationWeight', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.separation_weight = component.separationWeight;
  }

  // Validate useCenterOfMass
  if (component.useCenterOfMass !== undefined) {
    if (!validateBoolean(component.useCenterOfMass, 'useCenterOfMass')) {
      return undefined;
    }
    result.use_center_of_mass = component.useCenterOfMass;
  }

  return {
    'minecraft:flocking': result
  };
};

import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { ReflectProjectilesComponent } from '../../../interfaces/components/combat/reflect-projectiles-component';

/**
 * Converts a ReflectProjectilesComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertReflectProjectilesComponent = (
  component: Partial<ReflectProjectilesComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:reflect_projectiles': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate azimuthAngle
  if (component.azimuthAngle !== undefined) {
    if (typeof component.azimuthAngle !== 'string' && typeof component.azimuthAngle !== 'number') {
      console.error('azimuthAngle must be a string or number');

      return undefined;
    }
    result.azimuth_angle = component.azimuthAngle;
  }

  // Validate elevationAngle
  if (component.elevationAngle !== undefined) {
    if (typeof component.elevationAngle !== 'string' && typeof component.elevationAngle !== 'number') {
      console.error('elevationAngle must be a string or number');

      return undefined;
    }
    result.elevation_angle = component.elevationAngle;
  }

  // Validate reflectedProjectiles
  if (component.reflectedProjectiles !== undefined) {
    if (!Array.isArray(component.reflectedProjectiles)) {
      console.error('reflectedProjectiles must be an array');

      return undefined;
    }

    if (!component.reflectedProjectiles.every(item => typeof item === 'string')) {
      console.error('reflectedProjectiles must be an array of strings');

      return undefined;
    }

    result.reflected_projectiles = component.reflectedProjectiles;
  }

  // Validate reflectionScale
  if (component.reflectionScale !== undefined) {
    if (typeof component.reflectionScale !== 'string' && typeof component.reflectionScale !== 'number') {
      console.error('reflectionScale must be a string or number');

      return undefined;
    }
    result.reflection_scale = component.reflectionScale;
  }

  // Validate reflectionSound
  if (component.reflectionSound !== undefined) {
    if (typeof component.reflectionSound !== 'string') {
      console.error('reflectionSound must be a string');

      return undefined;
    }
    result.reflection_sound = component.reflectionSound;
  }

  return {
    'minecraft:reflect_projectiles': result
  };
};

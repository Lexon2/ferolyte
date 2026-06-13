import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { AnnotationBreakDoorComponent } from '../../../interfaces/components/miscellaneous/annotation-break-door-component';
import { validateNumber, validateString } from '../../common/validation';

/**
 * Converts an AnnotationBreakDoorComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertAnnotationBreakDoorComponent = (
  component: Partial<AnnotationBreakDoorComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:annotation.break_door': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate breakTime
  if (component.breakTime !== undefined) {
    if (!validateNumber(component.breakTime, 'breakTime', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.break_time = component.breakTime;
  }

  // Validate minDifficulty
  if (component.minDifficulty !== undefined) {
    if (!validateString(component.minDifficulty, 'minDifficulty')) {
      return undefined;
    }
    result.min_difficulty = component.minDifficulty;
  }

  return {
    'minecraft:annotation.break_door': result,
  };
};

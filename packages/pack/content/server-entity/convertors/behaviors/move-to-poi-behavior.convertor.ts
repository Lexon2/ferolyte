import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { POI_TYPE } from '../../constants/poi-type';
import { MoveToPoiBehavior } from '../../interfaces/behaviors/move-to-poi-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts a MoveToPoiBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertMoveToPoiBehavior = (
  behavior: Partial<MoveToPoiBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.move_to_poi': any } | undefined => {
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

  // Validate speedMultiplier
  if (behavior.speedMultiplier !== undefined) {
    if (!validateNumber(behavior.speedMultiplier, 'speedMultiplier')) {
      return undefined;
    }
    result.speed_multiplier = behavior.speedMultiplier;
  }

  // Validate poiType
  if (behavior.poiType !== undefined) {
    if (!POI_TYPE.includes(behavior.poiType)) {
      console.error('poiType must be a valid PoiType');

      return undefined;
    }
    result.poi_type = behavior.poiType;
  }

  return {
    'minecraft:behavior.move_to_poi': result
  };
};

import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { EquipItemBehavior } from '../../interfaces/behaviors/equip-item-behavior';
import { validateNumber } from '../common/validation';

/**
 * Converts an EquipItemBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertEquipItemBehavior = (
  behavior: Partial<EquipItemBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.equip_item': any } | undefined => {
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

  return {
    'minecraft:behavior.equip_item': result
  };
};

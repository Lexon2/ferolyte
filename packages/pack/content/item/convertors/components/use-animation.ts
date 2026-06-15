import { ItemUseAnimation } from '../../types/item-use-animation';
import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { validateAllowedValue } from '@ferolyte/common/content/validation/content-validation';

const VALID_ANIMATIONS: ItemUseAnimation[] = [
  'bow',
  'brush',
  'camera',
  'crossbow',
  'drink',
  'eat',
  'none',
  'spear',
  'spyglass',
];

/**
 * Creates a use_animation component for Minecraft items
 * @param value The animation to play when using the item
 * @returns The use_animation component in Minecraft format or undefined if validation fails
 */
export const createUseAnimation = (
  value?: ItemUseAnimation,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:use_animation': ItemUseAnimation } | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (
    !validateAllowedValue(
      value,
      VALID_ANIMATIONS,
      ctx,
      `Use animation must be one of: ${VALID_ANIMATIONS.join(', ')}`,
    )
  ) {
    return undefined;
  }

  return {
    'minecraft:use_animation': value,
  };
};

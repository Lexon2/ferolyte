import { ItemHoverTextColor } from '../../types/item-hover-text-color';
import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { validateAllowedValue } from '@artifex/common/content/validation/content-validation';

const VALID_COLORS: ItemHoverTextColor[] = [
  'black',
  'blue',
  'brown',
  'cyan',
  'gray',
  'green',
  'light_blue',
  'light_green',
  'magenta',
  'orange',
  'pink',
  'purple',
  'red',
  'silver',
  'white',
  'yellow',
];

/**
 * Creates a hover_text_color component for Minecraft items
 * @param value The color of the item name when hovered
 * @returns The hover_text_color component in Minecraft format or undefined if validation fails
 */
export const createHoverTextColor = (
  value?: ItemHoverTextColor,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:hover_text_color': ItemHoverTextColor } | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (
    !validateAllowedValue(
      value,
      VALID_COLORS,
      ctx,
      'Hover text color must be a valid Minecraft color',
    )
  ) {
    return undefined;
  }

  return {
    'minecraft:hover_text_color': value,
  };
};

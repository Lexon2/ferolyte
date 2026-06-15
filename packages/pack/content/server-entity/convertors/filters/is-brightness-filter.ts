import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { convertNumberFilter } from './common/convert-number-filter';
import { IsBrightnessFilter } from '../../interfaces/filters/is-brightness-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';
import { validateNumber } from '../common/validation';

/**
 * Converts an IsBrightnessFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertIsBrightnessFilter = (
  filter: Partial<IsBrightnessFilter>,
  ctx?: ContentDiagnosticContext,
): MinecraftJsonFilter | undefined => {
  if (!filter) {
    return undefined;
  }

  // Validate that value is within valid range (0-15)
  if (
    filter.value !== undefined &&
    !validateNumber(filter.value, 'value', 0, 15, ctx)
  ) {
    return undefined;
  }

  return convertNumberFilter(
    {
      ...filter,
      test: 'is_brightness',
    },
    ctx,
  );
};

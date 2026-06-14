import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { convertWithInputValues } from './common/convert-with-input-values';
import { EQUIPMENT_LOCATION_VALUES } from '../../constants/equipment-location';
import { AnySlotsEmptyFilter } from '../../interfaces/filters/any-slots-empty-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';

/**
 * Converts an AnySlotsEmptyFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertAnySlotsEmptyFilter = (
  filter: Partial<AnySlotsEmptyFilter>,
  ctx?: ContentDiagnosticContext
): MinecraftJsonFilter | undefined => {
  return convertWithInputValues({
      ...filter,
      test: 'any_slots_empty',
    },
    EQUIPMENT_LOCATION_VALUES, ctx);
};

import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { convertWithInputValues } from './common/convert-with-input-values';
import { EQUIPMENT_LOCATION_VALUES } from '../../constants/equipment-location';
import { AllSlotsEmptyFilter } from '../../interfaces/filters/all-slots-empty-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';

/**
 * Converts an AllSlotsEmptyFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertAllSlotsEmptyFilter = (
  filter: Partial<AllSlotsEmptyFilter>,
  ctx?: ContentDiagnosticContext
): MinecraftJsonFilter | undefined => {
  return convertWithInputValues({
      ...filter,
      test: 'all_slots_empty',
    },
    EQUIPMENT_LOCATION_VALUES, ctx);
};

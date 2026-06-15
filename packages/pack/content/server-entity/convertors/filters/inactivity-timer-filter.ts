import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { convertNumberFilter } from './common/convert-number-filter';
import { InactivityTimerFilter } from '../../interfaces/filters/inactivity-timer-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';

/**
 * Converts an InactivityTimerFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertInactivityTimerFilter = (
  filter: Partial<InactivityTimerFilter>,
  ctx?: ContentDiagnosticContext,
): MinecraftJsonFilter | undefined => {
  return convertNumberFilter(
    {
      ...filter,
      test: 'inactivity_timer',
    },
    ctx,
  );
};

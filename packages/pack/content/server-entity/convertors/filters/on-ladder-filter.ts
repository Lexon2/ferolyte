import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { convertBooleanFilter } from './common/convert-boolean-filter';
import { OnLadderFilter } from '../../interfaces/filters/on-ladder-filter';

/**
 * Converts a OnLadderFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertOnLadderFilter = (
  filter: Partial<OnLadderFilter>,
  ctx?: ContentDiagnosticContext
): ReturnType<typeof convertBooleanFilter> | undefined => {
  return convertBooleanFilter({
    ...filter,
    test: 'on_ladder',
  }, ctx);
};

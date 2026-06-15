import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { convertBooleanFilter } from './common/convert-boolean-filter';
import { OnGroundFilter } from '../../interfaces/filters/on-ground-filter';

/**
 * Converts a OnGroundFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertOnGroundFilter = (
  filter: Partial<OnGroundFilter>,
  ctx?: ContentDiagnosticContext,
): ReturnType<typeof convertBooleanFilter> | undefined => {
  return convertBooleanFilter(
    {
      ...filter,
      test: 'on_ground',
    },
    ctx,
  );
};

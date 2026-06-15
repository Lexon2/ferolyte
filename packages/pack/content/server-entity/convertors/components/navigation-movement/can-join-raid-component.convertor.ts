import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { CanJoinRaidComponent } from '../../../interfaces/components/navigation-movement/can-join-raid-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a CanJoinRaidComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertCanJoinRaidComponent = (
  component: Partial<CanJoinRaidComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:can_join_raid': any } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:can_join_raid': result,
  };
};

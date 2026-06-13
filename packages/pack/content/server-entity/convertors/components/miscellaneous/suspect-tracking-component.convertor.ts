import { SuspectTrackingComponent } from '../../../interfaces/components/miscellaneous/suspect-tracking-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a SuspectTrackingComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertSuspectTrackingComponent = (
  component: SuspectTrackingComponent,
): { 'minecraft:suspect_tracking': any } | undefined => {
  const result: any = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:suspect_tracking': result,
  };
};

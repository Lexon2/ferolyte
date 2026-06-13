import { ScaffoldingClimberComponent } from '../../../interfaces/components/miscellaneous/scaffolding-climber-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a ScaffoldingClimberComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertScaffoldingClimberComponent = (
  component: ScaffoldingClimberComponent,
): { 'minecraft:scaffolding_climber': any } | undefined => {
  const result: any = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:scaffolding_climber': result,
  };
};

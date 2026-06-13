import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { BlockClimberComponent } from '../../../interfaces/components/navigation-movement/block-climber-component';
import { validateBoolean } from '../../common/validation';

/**
 * Converts a BlockClimberComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertBlockClimberComponent = (
  component: Partial<BlockClimberComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:block_climber': any } | undefined => {
  if (!component) {
    return undefined;
  }

  if (component.value === undefined) {
    return {
      'minecraft:block_climber': {},
    };
  }

  if (!validateBoolean(component.value, 'value')) {
    return undefined;
  }

  // Block climber component has no properties, just return empty object
  return {
    'minecraft:block_climber': {},
  };
};

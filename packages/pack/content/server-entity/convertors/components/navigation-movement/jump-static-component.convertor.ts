import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { JumpStaticComponent } from '../../../interfaces/components/navigation-movement/jump-static-component';
import { validateNumber } from '../../common/validation';

/**
 * Converts a JumpStaticComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertJumpStaticComponent = (
  component: Partial<JumpStaticComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:jump.static': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate jumpPower
  if (component.jumpPower !== undefined) {
    if (
      !validateNumber(component.jumpPower, 'jumpPower', 0, Number.MAX_VALUE)
    ) {
      return undefined;
    }
    result.jump_power = component.jumpPower;
  }

  return {
    'minecraft:jump.static': result,
  };
};

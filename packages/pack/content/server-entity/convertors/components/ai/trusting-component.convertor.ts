import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { TrustingComponent } from '../../../interfaces/components/ai/trusting-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a TrustingComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertTrustingComponent = (
  component: Partial<TrustingComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:trusting': any } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:trusting': result,
  };
};

import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { PersistentComponent } from '../../../interfaces/components/ai/persistent-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a PersistentComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertPersistentComponent = (
  component: Partial<PersistentComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:persistent': any } | undefined => {
  const result: any = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:persistent': result,
  };
};

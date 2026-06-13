import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { OutOfControlComponent } from '../../../interfaces/components/ai/out-of-control-component';
import { convertStateObject } from '../../common/state-object';

/**
 * Converts a OutOfControlComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertOutOfControlComponent = (
  component: Partial<OutOfControlComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:out_of_control': any } | undefined => {
  const result: any = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:out_of_control': result,
  };
};

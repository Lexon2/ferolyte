import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { PeekComponent } from '../../../interfaces/components/miscellaneous/peek-component';
import { convertTrigger } from '../../common/trigger.convertor';

/**
 * Converts a PeekComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertPeekComponent = (
  component: Partial<PeekComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:peek': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate onClose
  if (component.onClose !== undefined) {
    const convertedOnClose = convertTrigger(component.onClose, withFieldPath(ctx, 'onClose'));
    if (!convertedOnClose) {
      return undefined;
    }
    result.on_close = convertedOnClose;
  }

  // Validate onOpen
  if (component.onOpen !== undefined) {
    const convertedOnOpen = convertTrigger(component.onOpen, withFieldPath(ctx, 'onOpen'));
    if (!convertedOnOpen) {
      return undefined;
    }
    result.on_open = convertedOnOpen;
  }

  // Validate onTargetOpen
  if (component.onTargetOpen !== undefined) {
    const convertedOnTargetOpen = convertTrigger(component.onTargetOpen, withFieldPath(ctx, 'onTargetOpen'));
    if (!convertedOnTargetOpen) {
      return undefined;
    }
    result.on_target_open = convertedOnTargetOpen;
  }

  return {
    'minecraft:peek': result,
  };
};

import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { AnnotationOpenDoorComponent } from '../../../interfaces/components/miscellaneous/annotation-open-door-component';
import { validateBoolean } from '../../common/validation';

/**
 * Converts an AnnotationOpenDoorComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertAnnotationOpenDoorComponent = (
  component: Partial<AnnotationOpenDoorComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:annotation.open_door': any } | undefined => {
  if (!component) {
    return undefined;
  }

  if (component.value === undefined) {
    return {
      'minecraft:annotation.open_door': {},
    };
  }

  if (!validateBoolean(component.value, 'value')) {
    return undefined;
  }

  return {
    'minecraft:annotation.open_door': {},
  };
};

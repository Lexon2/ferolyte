import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { TypeFamilyComponent } from '../../../interfaces/components/transformation-and-variants/type-family-component';
import { validateStringArray } from '../../common/validation';

/**
 * Converts a TypeFamilyComponent to Minecraft format
 * @param component The component to convert
 * @returns The converted component in Minecraft format or undefined if validation fails
 */
export const convertTypeFamilyComponent = (
  component: Partial<TypeFamilyComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:type_family': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  if (component.family !== undefined) {
    if (!validateStringArray(component.family, 'family')) {
      return undefined;
    }
    result.family = component.family;
  }

  return {
    'minecraft:type_family': result,
  };
};

import {
  withFieldPath,
  ContentDiagnosticContext,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { OnHurtComponent } from '../../../interfaces/components/event-hooks/on-hurt-component';
import { convertTrigger } from '../../common/trigger.convertor';
import { validateDamageSourceTypes } from '../../common/validation';

/**
 * Converts an OnHurtComponent to Minecraft format
 * @param component The component to convert
 * @returns The converted component in Minecraft format or undefined if validation fails
 */
export const convertOnHurtComponent = (
  component: Partial<OnHurtComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:on_hurt': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = convertTrigger(component, ctx);
  if (!result) {
    return undefined;
  }

  if (component.damageSources !== undefined) {
    const damageSources = Array.isArray(component.damageSources)
      ? component.damageSources
      : [component.damageSources];

    if (!validateDamageSourceTypes(damageSources, 'damageSources')) {
      return undefined;
    }
    result.damage_sources = damageSources;
  }

  return {
    'minecraft:on_hurt': result,
  };
};

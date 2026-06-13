import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { AttackDamageComponent } from '../../../interfaces/components/attribute/attack-damage-component';
import { convertAttributeComponent } from '../../common/attribute';

/**
 * Converts an AttackDamageComponent to Minecraft format
 * @param component The component to convert
 * @returns The converted component in Minecraft format or undefined if validation fails
 */
export const convertAttackDamageComponent = (
  component: Partial<AttackDamageComponent>,
  ctx?: ContentDiagnosticContext
): Record<string, any> | undefined => {
  return convertAttributeComponent(component, 'attack_damage');
};

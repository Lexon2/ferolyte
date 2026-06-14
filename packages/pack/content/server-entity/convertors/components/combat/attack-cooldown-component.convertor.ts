import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { AttackCooldownComponent } from '../../../interfaces/components/combat/attack-cooldown-component';
import { convertRange } from '../../common/convertors';
import { convertTrigger } from '../../common/trigger.convertor';

/**
 * Converts an AttackCooldownComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertAttackCooldownComponent = (
  component: Partial<AttackCooldownComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:attack_cooldown': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate attackCooldownCompleteEvent
  if (component.attackCooldownCompleteEvent !== undefined) {
    const convertedAttackCooldownCompleteEvent = convertTrigger(component.attackCooldownCompleteEvent, withFieldPath(ctx, 'attackCooldownCompleteEvent'));
    if (!convertedAttackCooldownCompleteEvent) {
      return undefined;
    }
    result.attack_cooldown_complete_event = convertedAttackCooldownCompleteEvent;
  }

  // Validate attackCooldownTime
  if (component.attackCooldownTime !== undefined) {
    const convertedAttackCooldownTime = convertRange(component.attackCooldownTime, 'attackCooldownTime');
    if (!convertedAttackCooldownTime) {
      return undefined;
    }
    result.attack_cooldown_time = convertedAttackCooldownTime;
  }

  return {
    'minecraft:attack_cooldown': result,
  };
};

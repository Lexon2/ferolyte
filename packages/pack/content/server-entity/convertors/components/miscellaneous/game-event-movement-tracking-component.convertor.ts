import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { GameEventMovementTrackingComponent } from '../../../interfaces/components/miscellaneous/game-event-movement-tracking-component';

/**
 * Converts a GameEventMovementTrackingComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertGameEventMovementTrackingComponent = (
  component: Partial<GameEventMovementTrackingComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:game_event_movement_tracking': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate emitFlap
  if (component.emitFlap !== undefined) {
    if (typeof component.emitFlap !== 'boolean') {
      console.error('emitFlap must be a boolean');

      return undefined;
    }
    result.emit_flap = component.emitFlap;
  }

  // Validate emitMove
  if (component.emitMove !== undefined) {
    if (typeof component.emitMove !== 'boolean') {
      console.error('emitMove must be a boolean');

      return undefined;
    }
    result.emit_move = component.emitMove;
  }

  // Validate emitSwim
  if (component.emitSwim !== undefined) {
    if (typeof component.emitSwim !== 'boolean') {
      console.error('emitSwim must be a boolean');

      return undefined;
    }
    result.emit_swim = component.emitSwim;
  }

  return {
    'minecraft:game_event_movement_tracking': result,
  };
};

import { EntityEventTrigger } from '../trigger';
import { BehaviorPriority } from './behavior-priority';

/**
 * Interface for the EmergeBehavior
 * Allows an entity to emerge
 */
export interface EmergeBehavior extends BehaviorPriority {
  /**
   * The cooldown time in seconds
   * @default 0.5
   */
  cooldownTime?: number;

  /**
   * The duration of the goal
   * @default 5.0
   */
  duration?: number;

  /**
   * The trigger to be executed when the goal execution is about to end
   */
  onDone?: EntityEventTrigger;
}

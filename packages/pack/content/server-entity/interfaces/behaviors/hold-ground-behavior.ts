import { BehaviorPriority } from './behavior-priority';
import { EntityEventTrigger } from '../trigger';

/**
 * The mob freezes and looks at the mob they are targeting.
 */
export interface HoldGroundBehavior extends BehaviorPriority {
  /**
   * Whether to broadcast out the mob's target to other mobs of the same type
   * @default false
   */
  broadcast?: boolean;

  /**
   * Range in blocks for how far to broadcast
   * @default 0.0
   */
  broadcastRange?: number;

  /**
   * Minimum distance the target must be for the mob to run this goal
   * @default 10.0
   */
  minRadius?: number;

  /**
   * Event to run when target is within the radius. This event is broadcasted if broadcast is true
   */
  withinRadiusEvent?: EntityEventTrigger;
}

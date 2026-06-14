import { EntityEventTrigger } from '../trigger';
import { BehaviorPriority } from './behavior-priority';

/**
 * Interface for the DigBehavior
 * Allows an entity to dig
 */
export interface DigBehavior extends BehaviorPriority {
  /**
   * If true, this behavior can run when this entity is named
   */
  allowDigWhenNamed?: boolean;

  /**
   * If true, this behavior can run when this entity is in daylight
   */
  digsInDaylight?: boolean;

  /**
   * The duration of the behavior
   */
  duration?: number;

  /**
   * The idle time of the behavior
   */
  idleTime?: number;

  /**
   * If true, suspicion is a disturbance
   */
  suspicionIsDisturbance?: boolean;

  /**
   * If true, vibration is a disturbance
   */
  vibrationIsDisturbance?: boolean;

  /**
   * The event to run when the behavior starts
   */
  onStart?: EntityEventTrigger;
}

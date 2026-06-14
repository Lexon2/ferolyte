import { BehaviorPriority } from './behavior-priority';
import { EntityEventTrigger } from '../trigger';

/**
 * Fires an event when this behavior starts, then waits for a duration before stopping. When stopping due to that timeout or due to being interrupted by another behavior, fires another event.
 */
export interface TimerFlag1Behavior extends BehaviorPriority {
  /**
   * Goal cooldown range in seconds.
   * @default [10.0, 10.0]
   */
  cooldownRange?: number | [number, number];

  /**
   * Goal duration range in seconds.
   * @default [2.0, 2.0]
   */
  durationRange?: number | [number, number];

  /**
   * UNDOCUMENTED
   */
  controlFlags?: ('move' | 'look')[];

  /**
   * Event to run when the goal ends.
   */
  onEnd?: EntityEventTrigger;

  /**
   * Event to run when the goal starts.
   */
  onStart?: EntityEventTrigger;
}

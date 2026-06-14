import { EntityEventTrigger } from '../trigger';
import { BehaviorPriority } from './behavior-priority';

/**
 * Allows this entity to celebrate surviving a raid by shooting fireworks
 */
export interface CelebrateSurviveBehavior extends BehaviorPriority {
  /**
   * Speed multiplier for this behavior
   */
  speedMultiplier?: number;

  /**
   * Minimum and maximum time between firework (positive, in seconds)
   * @default [10, 20]
   */
  fireworksInterval?:
    | [number, number]
    | number
    | { rangeMin: number; rangeMax: number };

  /**
   * The duration in seconds that the celebration lasts for
   * @default 30.0
   */
  duration?: number;

  /**
   * The event to trigger when the goal's duration expires
   */
  onCelebrationEndEvent?: EntityEventTrigger;
}

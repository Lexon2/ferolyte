import { EntityEventTrigger } from '../trigger';
import { BehaviorPriority } from './behavior-priority';

/**
 * Allows this entity to celebrate surviving a raid by making celebration sounds and jumping
 */
export interface CelebrateBehavior extends BehaviorPriority {
  /**
   * The sound event to trigger during the celebration
   */
  celebrationSound?: string;

  /**
   * The duration in seconds that the celebration lasts for
   * @default 30
   */
  duration?: number;

  /**
   * Minimum and maximum time between jumping (positive, in seconds)
   * @default [1, 3.5]
   */
  jumpInterval?:
    | [number, number]
    | number
    | { rangeMin: number; rangeMax: number };

  /**
   * The event to trigger when the goal's duration expires
   */
  onCelebrationEndEvent?: EntityEventTrigger;

  /**
   * Minimum and maximum time between sound events (positive, in seconds)
   * @default [2, 7]
   */
  soundInterval?:
    | [number, number]
    | number
    | { rangeMin: number; rangeMax: number };
}

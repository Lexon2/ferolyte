import { BehaviorPriority } from './behavior-priority';
import { EntityFilters } from '../filters';

/**
 * Allows the mob to drink milk based on specified environment conditions.
 */
export interface DrinkMilkBehavior extends BehaviorPriority {
  /**
   * Time (in seconds) that the goal is on cooldown before it can be used again
   * @default 5.0
   */
  cooldownSeconds?: number;

  /**
   * Conditions that need to be met for the behavior to start
   */
  filters?: EntityFilters;
}

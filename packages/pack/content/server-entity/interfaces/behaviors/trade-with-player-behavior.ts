import { BehaviorPriority } from './behavior-priority';
import { EntityFilters } from '../filters';

/**
 * Allows the player to trade with this mob.
 */
export interface TradeWithPlayerBehavior extends BehaviorPriority {
  /**
   * Conditions that need to be met for the behavior to start.
   */
  filters?: EntityFilters;
}

import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to stay afloat while swimming.
 */
export interface FloatBehavior extends BehaviorPriority {
  /**
   * If true, the mob will keep sinking as long as it has passengers
   * @default false
   */
  sinkWithPassengers?: boolean;
}

import { BehaviorPriority } from './behavior-priority';

/**
 * Allows an entity to sit in place, similar to the ocelot entity animation pose.
 */
export interface OcelotSitOnBlockBehavior extends BehaviorPriority {
  /**
   * The speed multiplier for the mob while sitting
   * @default 1.0
   */
  speedMultiplier?: number;
}

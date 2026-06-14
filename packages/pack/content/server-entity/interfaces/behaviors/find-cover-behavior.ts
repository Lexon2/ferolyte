import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to seek shade.
 */
export interface FindCoverBehavior extends BehaviorPriority {
  /**
   * Time in seconds the mob has to wait before using the goal again
   * @default 0
   */
  cooldownTime?: number;
}

import { BaseFilter } from './base-filter';

/**
 * Returns true if the subject entity is fleeing from other mobs
 */
export interface IsAvoidingMobsFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}

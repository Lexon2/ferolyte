import { BaseFilter } from './base-filter';

/**
 * Tests the health of the subject
 */
export interface ActorHealthFilter extends BaseFilter {
  /**
   * The health value to test against
   */
  value: number;
}

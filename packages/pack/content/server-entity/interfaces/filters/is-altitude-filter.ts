import { BaseFilter } from './base-filter';

/**
 * Tests the current altitude against a provided value. 0= bedrock elevation
 */
export interface IsAltitudeFilter extends BaseFilter {
  /**
   * The altitude value to compare with
   */
  value: number;
}

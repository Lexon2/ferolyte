import { BaseFilter } from './base-filter';

/**
 * Tests if the specified duration in seconds of inactivity for despawning has been reached
 */
export interface InactivityTimerFilter extends BaseFilter {
  /**
   * The Family name to look for
   */
  value: number;
}

import { BaseFilter } from './base-filter';

/**
 * Tests whether the Subject is currently in the named biome
 */
export interface IsBiomeFilter extends BaseFilter {
  /**
   * The biome type to test
   */
  value: string;
}

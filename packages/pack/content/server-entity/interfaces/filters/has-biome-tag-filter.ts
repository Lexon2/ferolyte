import { BaseFilter } from './base-filter';

/**
 * Tests whether the biome the subject is in has the specified tag
 */
export interface HasBiomeTagFilter extends BaseFilter {
  /**
   * The tag to look for
   */
  value: string;
}

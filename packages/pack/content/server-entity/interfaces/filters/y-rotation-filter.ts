import { BaseFilter } from './base-filter';

/**
 * Returns the Y rotation of this entity
 */
export interface YRotationFilter extends BaseFilter {
  /**
   * The Y rotation value to compare with
   */
  value: number;
}

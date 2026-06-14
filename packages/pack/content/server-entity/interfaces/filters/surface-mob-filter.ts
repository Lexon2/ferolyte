import { BaseFilter } from './base-filter';

/**
 * Tests if the subject is a surface mob
 */
export interface SurfaceMobFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}

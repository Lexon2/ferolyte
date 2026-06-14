import { BaseFilter } from './base-filter';

/**
 * Returns true when the subject entity is in Nether
 */
export interface InNetherFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}

import { BaseFilter } from './base-filter';

/**
 * Returns true when the subject entity is in the clouds
 */
export interface InCloudsFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}

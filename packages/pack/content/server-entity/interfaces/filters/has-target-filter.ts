import { BaseFilter } from './base-filter';

/**
 * Returns true if the subject entity has a valid target
 */
export interface HasTargetFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}

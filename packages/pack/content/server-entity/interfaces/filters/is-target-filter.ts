import { BaseFilter } from './base-filter';

/**
 * Returns true if the subject entity is the target of the calling entity
 */
export interface IsTargetFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}

import { BaseFilter } from './base-filter';

/**
 * Returns true if the subject entity is the owner of the calling entity
 */
export interface IsOwnerFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}

import { BaseFilter } from './base-filter';

/**
 * Returns true when the subject entity is in lava
 */
export interface InLavaFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}

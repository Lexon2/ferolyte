import { BaseFilter } from './base-filter';

/**
 * Returns true when the subject entity is in Overworld
 */
export interface InOverworldFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}

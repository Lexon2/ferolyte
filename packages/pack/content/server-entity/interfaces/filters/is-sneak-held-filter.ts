import { BaseFilter } from './base-filter';

/**
 * Returns true if the subject entity has the sneak input held
 */
export interface IsSneakHeldFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}

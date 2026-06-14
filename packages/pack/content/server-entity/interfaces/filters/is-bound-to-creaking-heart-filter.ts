import { BaseFilter } from './base-filter';

/**
 * Tests that the Creaking Heart that spawned the subject Creaking still exists
 */
export interface IsBoundToCreakingHeartFilter extends BaseFilter {
  /**
   * True or false
   * @default true
   */
  value?: boolean;
}

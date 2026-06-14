import { BaseFilter } from './base-filter';

/**
 * Tests for the presence of a property of the subject entity
 */
export interface HasPropertyFilter extends BaseFilter {
  /**
   * The property name to look for
   */
  value: string;
}

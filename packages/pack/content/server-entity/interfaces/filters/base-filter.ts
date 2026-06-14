import { FilterOperator } from '../../constants/filter-operators';
import { FilterSubject } from '../../constants/filter-subjects';

/**
 * Base interface for all filters
 */
export interface BaseFilter {
  /**
   * The comparison to apply with value
   * @default "equals"
   */
  operator?: FilterOperator;

  /**
   * The subject of this filter test
   * @default "self"
   */
  subject?: FilterSubject;
}

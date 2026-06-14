import { BaseFilter } from './base-filter';
import { Difficulty } from '../../constants/difficulties';


/**
 * Returns true when the subject entity is the given difficulty
 */
export interface IsDifficultyFilter extends BaseFilter {
  /**
   * The difficulty to test
   */
  value: Difficulty;
}

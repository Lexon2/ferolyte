import { BaseFilter } from './base-filter';
import { GameRule } from '../../constants/game-rule';

/**
 * Returns true when the given game rule is enabled
 */
export interface IsGameRuleFilter extends BaseFilter {
  /**
   * The game rule to test
   */
  domain: GameRule;

  /**
   * True or false
   * @default true
   */
  value?: boolean;
}

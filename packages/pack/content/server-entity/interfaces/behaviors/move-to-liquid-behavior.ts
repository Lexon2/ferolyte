import { BehaviorPriority } from './behavior-priority';
import { LiquidMaterialType } from '../../constants/liquid-material-type';

/**
 * Allows the mob to move into a liquid when on land.
 */
export interface MoveToLiquidBehavior extends BehaviorPriority {
  /**
   * The speed multiplier for the mob while moving to liquid
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * Distance in blocks within the mob considers it has reached the goal
   * @default 0.5
   */
  goalRadius?: number;

  /**
   * The number of blocks each tick that the mob will check within its search range and height for a valid block to move to
   * @default 10
   */
  searchCount?: number;

  /**
   * Height in blocks the mob will look for liquid to move towards
   * @default 1
   */
  searchHeight?: number;

  /**
   * The distance in blocks it will look for liquid to move towards
   * @default 0
   */
  searchRange?: number;

  /**
   * The material type of the liquid block to find
   * @default "Any"
   */
  materialType?: LiquidMaterialType;
}

import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the mob to stay at a certain level when in liquid.
 */
export interface RiseToLiquidLevelBehavior extends BehaviorPriority {
  /**
   * Vertical offset from the liquid
   * @default 0.0
   */
  liquidYOffset?: number;

  /**
   * Displacement for how much the entity will move up in the vertical axis
   * @default 0.0
   */
  riseDelta?: number;

  /**
   * Displacement for how much the entity will move down in the vertical axis
   * @default 0.0
   */
  sinkDelta?: number;
}

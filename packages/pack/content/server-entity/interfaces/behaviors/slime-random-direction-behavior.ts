import { BehaviorPriority } from './behavior-priority';

export interface SlimeRandomDirectionBehavior extends BehaviorPriority {
  /**
   * Additional time (in whole seconds), chosen randomly in the range of [0, "addRandomTimeRange"], to add to "minChangeDirectionTime".
   * @default 3
   */
  addRandomTimeRange?: number;

  /**
   * Constant minimum time (in seconds) to wait before choosing a new direction.
   * @default 2
   */
  minChangeDirectionTime?: number;

  /**
   * Maximum rotation angle range (in degrees) when randomly choosing a new direction.
   * @default 360
   */
  turnRange?: number;
}

import { BehaviorPriority } from './behavior-priority';
import { PoiType } from '../../constants/poi-type';

/**
 * Allows the mob to move to a POI if able to.
 */
export interface MoveToPoiBehavior extends BehaviorPriority {
  /**
   * The speed multiplier for the mob while moving to the POI
   * @default 1.0
   */
  speedMultiplier?: number;

  /**
   * Tells the goal what POI type it should be looking for
   */
  poiType?: PoiType;
}

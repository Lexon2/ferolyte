import { BehaviorPriority } from './behavior-priority';
import { EntityFilters } from '../filters';

/**
 * [EXPERIMENTAL BEHAVIOR] Allows the entity to croak at a random time interval with configurable conditions
 */
export interface CroakBehavior extends BehaviorPriority {
  /**
   * Random range in seconds after which the croaking stops. Can also be a constant
   */
  duration?: [number, number] | number | { rangeMin: number; rangeMax: number };

  /**
   * Conditions for the behavior to start and keep running
   * The interval between runs only starts after passing the filters
   */
  filters?: EntityFilters;

  /**
   * Random range in seconds between runs of this behavior. Can also be a constant
   */
  interval?: [number, number] | number | { rangeMin: number; rangeMax: number };
}

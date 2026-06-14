import { BaseNavigation } from './base-navigation';

/**
 * Interface for the navigation_walk component
 * Defines the speed with which an entity can walk
 */
export interface NavigationWalkComponent extends BaseNavigation {
  /**
   * Tells the pathfinder whether or not it can float
   * @default false
   */
  canFloat?: boolean;
}

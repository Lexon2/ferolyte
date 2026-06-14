import { BehaviorPriority } from './behavior-priority';
import { EntityFilters } from '../filters';

/**
 * Allows the mob to follow other mobs.
 */
export interface FollowMobBehavior extends BehaviorPriority {
  /**
   * If non-empty, provides criteria for filtering which nearby Mobs can be followed. If empty default criteria will be used, which will exclude Players, Squid variants, Fish variants, Tadpoles, Dolphins, and mobs of the same type as the owner of the Goal
   */
  filters?: EntityFilters;

  /**
   * The type of actor to prefer following. If left unspecified, a random actor among those in range will be chosen
   */
  preferredActorType?: string;

  /**
   * The speed multiplier for the mob's movement
   */
  speedMultiplier?: number;

  /**
   * The distance in blocks it will look for a mob to follow
   * @default 0
   */
  searchRange?: number;

  /**
   * The distance in blocks this mob stops from the mob it is following
   * @default 2
   */
  stopDistance?: number;

  /**
   * If true, the mob will respect the 'minecraft:home' component's 'restriction_radius' field when choosing a target to follow. If false, it will choose target position without considering home restrictions
   * @default true
   */
  useHomePositionRestriction?: boolean;
}

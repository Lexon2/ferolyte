import { BehaviorPriority } from './behavior-priority';


/**
 * Sniff compels this entity to detect the nearest player within "sniffing_radius" and update its minecraft:suspect_tracking component state.
 */
export interface SniffBehavior extends BehaviorPriority {
  /**
   * Cooldown range between sniffs in seconds
   * @default [3.0, 10.0]
   */
  cooldownRange?: [number, number];

  /**
   * Sniffing duration in seconds
   * @default 1.0
   */
  duration?: number;

  /**
   * Mob detection radius
   * @default 5.0
   */
  sniffingRadius?: number;

  /**
   * Mob suspicion horizontal radius. When a player is within this radius horizontally, the anger level towards that player is increased
   * @default 3.0
   */
  suspicionRadiusHorizontal?: number;

  /**
   * Mob suspicion vertical radius. When a player is within this radius vertically, the anger level towards that player is increased
   * @default 3.0
   */
  suspicionRadiusVertical?: number;
}

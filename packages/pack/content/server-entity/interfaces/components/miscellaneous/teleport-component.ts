/**
 * Interface for the teleport component
 * Defines an entity's teleporting behavior.
 */
export interface TeleportComponent {
  /**
   * Modifies the chance that the entity will teleport if the entity is in darkness
   * @default 0.01
   */
  darkTeleportChance?: number;

  /**
   * Modifies the chance that the entity will teleport if the entity is in daylight
   * @default 0.01
   */
  lightTeleportChance?: number;

  /**
   * Maximum amount of time in seconds between random teleports
   * @default 20
   */
  maxRandomTeleportTime?: number;

  /**
   * Minimum amount of time in seconds between random teleports
   * @default 0
   */
  minRandomTeleportTime?: number;

  /**
   * Entity will teleport to a random position within the area defined by this cube
   * @default [32.0, 16.0, 32.0]
   */
  randomTeleportCube?: [number, number, number];

  /**
   * If true, the entity will teleport randomly
   * @default true
   */
  randomTeleports?: boolean;

  /**
   * Maximum distance the entity will teleport when chasing a target
   * @default 16.0
   */
  targetDistance?: number;

  /**
   * The chance that the entity will teleport between 0.0 and 1.0. 1.0 means 100%
   * @default 1.0
   */
  targetTeleportChance?: number;
}

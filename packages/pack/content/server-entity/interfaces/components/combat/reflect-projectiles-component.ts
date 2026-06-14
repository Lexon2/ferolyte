/**
 * Interface for the reflect_projectiles component
 * [EXPERIMENTAL] Allows an entity to reflect projectiles.
 */
export interface ReflectProjectilesComponent {
  /**
   * A Molang expression defining the angle in degrees to add to the projectile's y axis rotation
   * @default 0
   */
  azimuthAngle?: string | number;

  /**
   * A Molang expression defining the angle in degrees to add to the projectile's x axis rotation
   * @default 0
   */
  elevationAngle?: string | number;

  /**
   * An array of strings defining the types of projectiles that are reflected when they hit the entity
   */
  reflectedProjectiles?: string[];

  /**
   * A Molang expression defining the velocity scaling of the reflected projectile
   * @default 1
   */
  reflectionScale?: string | number;

  /**
   * A string defining the name of the sound event to be played when a projectile is reflected
   * @default "reflect"
   */
  reflectionSound?: string;
}

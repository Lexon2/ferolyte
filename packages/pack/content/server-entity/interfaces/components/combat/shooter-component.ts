import { EntityFilters } from '../../filters';

/**
 * Interface for the shooter component
 * Defines the entity's ranged attack behavior
 */
export interface ShooterComponent {
  /**
   * ID of the Potion effect to be applied on hit
   * @default -1
   */
  auxVal?: number;

  /**
   * Actor definition to use as projectile for the ranged attack
   */
  def?: string;

  /**
   * Sets whether the projectiles being used are flagged as magic
   * @default false
   */
  magic?: boolean;

  /**
   * Velocity in which the projectiles will be shot
   * @default 0.0
   */
  power?: number;

  /**
   * List of projectiles that can be used by the shooter
   */
  projectiles?: Array<string | Projectile>;

  /**
   * Sound that is played when the shooter shoots a projectile
   */
  sound?: string;
}

export interface Projectile {
  /**
   * ID of the Potion effect to be applied on hit
   * @default -1
   */
  auxVal?: number;

  /**
   * Actor definition to use as projectile for the ranged attack
   */
  def?: string;

  /**
   * Filters to apply to the projectile
   */
  filters?: EntityFilters;
}


import { EntityFilters } from '../../filters';

/**
 * Interface for the area_attack component
 * A component that does damage to entities that get within range.
 */
export interface AreaAttackComponent {
  /**
   * The type of damage that is applied to entities that enter the damage range
   */
  cause?: string;

  /**
   * Attack cooldown (in seconds) for how often this entity can attack a target
   * @default 0
   */
  damageCooldown?: number;

  /**
   * How much damage per tick is applied to entities that enter the damage range
   * @default 2
   */
  damagePerTick?: number;

  /**
   * How close a hostile entity must be to have the damage applied
   * @default 0.2
   */
  damageRange?: number;

  /**
   * The set of entities that are valid to apply the damage to when within range
   */
  entityFilter?: EntityFilters;

  /**
   * If the entity should play their attack sound when attacking a target
   * @default true
   */
  playAttackSound?: boolean;
}

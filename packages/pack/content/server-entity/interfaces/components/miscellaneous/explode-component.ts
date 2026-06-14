import { ExplosionParticleEffect } from '../../../constants/explosion-particle-effect';

/**
 * Interface for the explode component
 * Defines the explosion properties for an entity.
 */
export interface ExplodeComponent {
  /**
   * If true, the explosion will affect blocks and entities under water
   * @default false
   */
  allowUnderwater?: boolean;

  /**
   * If true, the explosion will destroy blocks in the explosion radius
   * @default true
   */
  breaksBlocks?: boolean;

  /**
   * If true, blocks in the explosion radius will be set on fire
   * @default false
   */
  causesFire?: boolean;

  /**
   * A scale factor applied to the explosion's damage to entities
   * A value of 0 prevents the explosion from dealing any damage
   * Negative values cause the explosion to heal entities instead
   * @default 1.0
   */
  damageScaling?: number;

  /**
   * If true, whether the explosion breaks blocks is affected by the mob griefing game rule
   * @default false
   */
  destroyAffectedByGriefing?: boolean;

  /**
   * If true, whether the explosion causes fire is affected by the mob griefing game rule
   * @default false
   */
  fireAffectedByGriefing?: boolean;

  /**
   * The range for the random amount of time the fuse will be lit before exploding
   * A negative value means the explosion will be immediate
   * @default [0.0, 0.0]
   */
  fuseLength?: number | [number, number];

  /**
   * If true, the fuse is already lit when this component is added to the entity
   * @default false
   */
  fuseLit?: boolean;

  /**
   * A scale factor applied to the knockback force caused by the explosion
   * @default 1.0
   */
  knockbackScaling?: number;

  /**
   * A blocks explosion resistance will be capped at this value when an explosion occurs
   */
  maxResistance?: number;

  /**
   * Defines whether the explosion should apply fall damage negation to Players above the point of collision
   * @default false
   */
  negatesFallDamage?: boolean;

  /**
   * The name of the particle effect to use
   * @default "explosion"
   */
  particleEffect?: ExplosionParticleEffect;

  /**
   * The radius of the explosion in blocks and the amount of damage the explosion deals
   * @default 3
   */
  power?: number;

  /**
   * The name of the sound effect played when the explosion triggers
   * @default "explode"
   */
  soundEffect?: string;

  /**
   * If true, the explosion will toggle blocks in the explosion radius
   * @default false
   */
  togglesBlocks?: boolean;
}

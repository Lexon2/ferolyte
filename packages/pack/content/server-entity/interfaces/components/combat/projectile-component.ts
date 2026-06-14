import { SoundEvent } from '../../../constants/sound-events';
import { EntityFilters } from '../../filters';
import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the projectile component
 * Allows the entity to be a thrown entity
 */
export interface ProjectileComponent {
  /**
   * Allows you to choose an anchor point for where the projectile is fired from
   * @default 0
   */
  anchor?: 0 | 1 | 2;

  /**
   * Alters the angle at which a projectile is vertically shot
   * @default 0
   */
  angleOffset?: number;

  /**
   * If true, the entity hit will be set on fire
   * @default false
   */
  catchFire?: boolean;

  /**
   * If true, when a projectile deals damage, whether or not to spawn in the critical damage particles
   * @default false
   */
  critParticleOnHurt?: boolean;

  /**
   * When this projectile deals damage, whether or not to immediately destroy this projectile
   * @default false
   */
  destroyOnHurt?: boolean;

  /**
   * Entity Definitions defined here can't be hurt by the projectile
   */
  filter?: EntityFilters;

  /**
   * If true, whether the projectile causes fire is affected by the mob griefing game rule
   * @default false
   */
  fireAffectedByGriefing?: boolean;

  /**
   * The gravity applied to this entity when thrown
   * @default 0.05
   */
  gravity?: number;

  /**
   * If true, when hitting a vehicle, and there's at least one passenger in the vehicle, the damage will be dealt to the passenger closest to the projectile impact point
   * @default false
   */
  hitNearestPassenger?: boolean;

  /**
   * An array of strings defining the types of entities that this entity does not collide with
   */
  ignoredEntities?: string[];

  /**
   * The sound that plays when the projectile hits the ground
   */
  hitGroundSound?: SoundEvent;

  /**
   * The sound that plays when the projectile hits something
   */
  hitSound?: SoundEvent;

  /**
   * If true, the projectile homes in to the nearest entity
   * @default false
   */
  homing?: boolean;

  /**
   * The fraction of the projectile's speed maintained every frame while traveling in air
   * @default 0.99
   */
  inertia?: number;

  /**
   * If true, the projectile will be treated as dangerous to the players
   * @default false
   */
  isDangerous?: boolean;

  /**
   * If true, the projectile will knock back the entity it hits
   * @default true
   */
  knockback?: boolean;

  /**
   * If true, the entity hit will be struck by lightning
   * @default false
   */
  lightning?: boolean;

  /**
   * The fraction of the projectile's speed maintained every frame while traveling in water
   * @default 0.6
   */
  liquidInertia?: number;

  /**
   * If true, the projectile can hit multiple entities per flight
   * @default true
   */
  multipleTargets?: boolean;

  /**
   * The offset from the entity's anchor where the projectile will spawn
   * @default [0, 0.0, 0]
   */
  offset?: [number, number, number];

  /**
   * Time in seconds that the entity hit will be on fire for
   * @default 5
   */
  onFireTime?: number;

  /**
   * Defines the behaviors that may execute on a projectile's hit
   */
  onHit?: ProjectileOnHit;

  /**
   * Particle to use upon collision
   * @default "iconcrack"
   */
  particle?: string;

  /**
   * Defines the effect the arrow will apply to the entity it hits
   * @default -1
   */
  potionEffect?: number;

  /**
   * Determines the velocity of the projectile
   * @default 1.3
   */
  power?: number;

  /**
   * During the specified time, in seconds, the projectile cannot be reflected by hitting it
   * @default 0
   */
  reflectImmunity?: number;

  /**
   * If true, this entity will be reflected back when hit
   * @default false
   */
  reflectOnHurt?: boolean;

  /**
   * If true, damage will be randomized based on damage and speed
   * @default false
   */
  semiRandomDiffDamage?: boolean;

  /**
   * The sound that plays when the projectile is shot
   */
  shootSound?: SoundEvent;

  /**
   * If true, the projectile will be shot towards the target of the entity firing it
   * @default true
   */
  shootTarget?: boolean;

  /**
   * If true, the projectile will bounce upon hit
   * @default false
   */
  shouldBounce?: boolean;

  /**
   * If true, the projectile will be treated like a splash potion
   * @default false
   */
  splashPotion?: boolean;

  /**
   * Radius in blocks of the 'splash' effect
   * @default 4
   */
  splashRange?: number;

  /**
   * Determines if the projectile stops when the target is hurt
   */
  stopOnHurt?: boolean;

  /**
   * The base accuracy
   * @default 0
   */
  uncertaintyBase?: number;

  /**
   * Determines how much difficulty affects accuracy
   * @default 0
   */
  uncertaintyMultiplier?: number;
}

export interface ProjectileOnHit {
  /**
   * The target receives a mob effect. See the table below for all arrow_effect parameters.
   */
  arrowEffect?: {
    /**
     * If true, the effect will be applied to blocking targets.
     */
    applyEffectToBlockingTargets?: boolean;
  };

  /**
   * Determines if the struck object is set on fire.
   * @default false
   */
  catchFire?: boolean;

  /**
   * The event that is triggered on a hit. See the table below for all definition event parameters.
   */
  definitionEvent?: {
    /**
     * The projectile that will be affected by this event.
     * @default false
     */
    affectProjectile?: boolean;

    /**
     * The shooter that will be affected by this event.
     * @default false
     */
    affectShooter?: boolean;

    /**
     * All entities in the splash area will be affected by this event.
     * @default false
     */
    affectSplashArea?: boolean;

    /**
     * The target will be affected by this event.
     * @default false
     */
    affectTarget?: boolean;

    /**
     * The event triggered. Also has an option filters parameter to limit affected targets.
     */
    eventTrigger?: EntityEventTrigger;

    /**
     * The splash area that will be affected.
     * @default 0.0
     */
    splashArea?: number;
  };

  /**
   * If the target is on fire, then douse the fire.
   * @default false
   */
  douseFire?: boolean;

  /**
   * An area of entities that is frozen to block on hits. Has shape of either sphere or cube, snap_to_block boolean, and size decimal properties.
   */
  freezeOnHit?: {
    /**
     * The shape of the area that is frozen.
     * @default "sphere"
     */
    shape?: 'sphere' | 'cube';

    /**
     * If true, the area will snap to the nearest block.
     * @default false
     */
    snapToBlock?: boolean;

    /**
     * The size of the area that is frozen.
     * @default 0.0
     */
    size?: number;
  };

  /**
   * Grants XP on hit. Has minXP for minimum XP granted, maxXp for maximum, or simply flat xp properties.
   */
  grantXp?: {
    /**
     * The minimum XP granted.
     * @default 0
     */
    minXP?: number;

    /**
     * The maximum XP granted.
     * @default 0
     */
    maxXP?: number;
  };

  /**
   * Determines if the owner of the entity is hurt on hit. Contains decimal owner_damage, knockback boolean, and ignite boolean.
   */
  hurtOwner?: {
    /**
     * The amount of damage the owner will take.
     * @default 0
     */
    ownerDamage?: number;

    /**
     * If true, the owner will be knocked back.
     * @default false
     */
    knockback?: boolean;

    /**
     * If true, the owner will be set on fire.
     * @default false
     */
    ignite?: boolean;
  };

  /**
   * Determines if a fire may be started on a flammable target.
   * @default false
   */
  ignite?: boolean;

  /**
   * Defines the damage that an entity may receive on being hit by this projectile. See the table below for all impact_damage parameters.
   */
  impactDamage?: {
    /**
     * Determines if the struck object is set on fire.
     * @default false
     */
    catchFire?: boolean;

    /**
     * Whether lightning can be channeled through the weapon.
     * @default true
     */
    channeling?: boolean;

    /**
     * The damage dealt on impact.
     * @default 1
     */
    damage?: number | [number, number];

    /**
     * Projectile is removed on hit.
     * @default false
     */
    destroyOnHit?: boolean;

    /**
     * If true, then the hit must cause damage to destroy the projectile.
     * @default true
     */
    destroyOnHitRequiresDamage?: boolean;

    /**
     * The identifier of an entity that can be hit.
     * @default "not set"
     */
    filter?: string;

    /**
     * If true, the projectile will knock back the entity it hits.
     * @default true
     */
    knockback?: boolean;

    /**
     * Maximum critical damage.
     */
    maxCriticalDamage?: number;

    /**
     * Minimum critical damage.
     * @default 0
     */
    minCriticalDamage?: number;

    /**
     * How much the base damage is multiplied.
     * @default 2.0
     */
    powerMultiplier?: number;

    /**
     * If true, damage will be randomized based on damage and speed.
     * @default false
     */
    semiRandomDiffDamage?: boolean;

    /**
     * If true, then the hit must cause damage to update the last hurt property.
     * @default false
     */
    setLastHurtRequiresDamage?: boolean;
  };

  /**
   * The target receives a mob effect. See the table below for all mob_effect parameters.
   */
  mobEffect?: {
    /**
     * If true, a mob will spawn that is not hostile, like the bat entity in Minecraft.
     * @default false
     */
    ambient?: boolean;

    /**
     * The multiplier of the amplification of this effect.
     * @default 1
     */
    amplifier?: number;

    /**
     * The effect's duration.
     * @default 1
     */
    duration?: number | 'infinite';

    /**
     * The effect's duration on easy mode.
     * @default 0
     */
    durationEasy?: number | 'infinite';

    /**
     * The effect's duration on hard mode.
     * @default 800
     */
    durationHard?: number | 'infinite';

    /**
     * The effect's duration on normal mode.
     * @default 200
     */
    durationNormal?: number | 'infinite';

    /**
     * The identifier of the mob entity to affect.
     */
    effect?: string;

    /**
     * Does the entity's look change.
     * @default false
     */
    visible?: boolean;
  };

  /**
   * The amount of time a target will remain on fire.
   * @default 0.0
   */
  onFireTime?: number;

  /**
   * The particles that spawn on hit. See the table below for all particle_on_hit parameters.
   */
  particleOnHit?: {
    /**
     * The number of particles to spawn.
     * @default 6
     */
    numParticles?: number;

    /**
     * If true, spawns particles on an entity hit.
     * @default false
     */
    onEntityHit?: boolean;

    /**
     * If true, spawns particles on any other hit.
     * @default false
     */
    onOtherHit?: boolean;

    /**
     * The id of the particle to spawn on hit.
     * @default "not set"
     */
    particleType?: string;

    /**
     * Maps an item name to an actor filter to determine what the name of the item used in the particle should be.
     */
    particleItemName?: {
      [key: string]: EntityFilters;
    };
  };

  /**
   * Defines the effect the arrow will apply to the entity it hits.
   * @default -1
   */
  potionEffect?: number;

  /**
   * Removes the projectile.
   */
  removeOnHit?: {};

  /**
   * Potion spawns an area of effect cloud. See the table below for all spawn_aoe_cloud parameters.
   */
  spawnAoeCloud?: {
    /**
     * Determines if the projectile shooter is affected.
     * @default true
     */
    affectOwner?: boolean;

    /**
     * Particle color defined by three rgb values.
     */
    color?: [number, number, number];

    /**
     * How long the particle emits.
     * @default 0
     */
    duration?: number;

    /**
     * The particle emitter.
     */
    particle?: string;

    /**
     * The id of the potion.
     * @default -1
     */
    potion?: number;

    /**
     * Defines the affected area.
     * @default 0
     */
    radius?: number;

    /**
     * Defines the affected area when potion is used.
     * @default -1
     */
    radiusOnUse?: number;

    /**
     * Delay before the potion can affect the area again.
     * @default 0
     */
    reapplicationDelay?: number;
  };

  /**
   * Contains information on the chance of spawning an entity on hit. See parameters below.
   */
  spawnChance?: {
    /**
     * The amount of new entities spawned.
     * @default 0
     */
    firstSpawnCount?: number;

    /**
     * The chance that a spawn occurs when a projectile hits the entity.
     * @default 0
     */
    firstSpawnPercentChance?: number;

    /**
     * The chance that a first spawn occurs when a projectile hits the entity.
     * @default 8
     */
    firstSpawnChance?: number;

    /**
     * The chance that a second spawn occurs when a projectile hits the entity.
     * @default 32
     */
    secondSpawnChance?: number;

    /**
     * The amount of new entities spawned in the second spawn.
     * @default 0
     */
    secondSpawnCount?: number;

    /**
     * Determines if a baby spawns.
     * @default false
     */
    spawnBaby?: boolean;

    /**
     * The entity that will spawn.
     * @default "not set"
     */
    spawnDefinition?: string;

    /**
     * Triggered on the newly spawned entity with other set to the owning entity.
     */
    onSpawn?: EntityEventTrigger[];
  };

  /**
   * Decides if the object sticks in ground and contains shake_time integer parameter to determine how long it will shake.
   */
  stickInGround?: {
    /**
     * The time in ticks that the projectile will shake.
     * @default 0
     */
    shakeTime?: number;
  };

  /**
   * Determines if the owner is transported on hit.
   * @default false
   */
  teleportOwner?: boolean;

  /**
   * Creates a splash area for effects caused by a thrown potion.
   */
  thrownPotionEffect?: {};
}

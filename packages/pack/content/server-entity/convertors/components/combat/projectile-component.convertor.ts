import {
  ProjectileComponent,
  ProjectileOnHit,
} from '../../../interfaces/components/combat/projectile-component';
import { convertEntityFilters } from '../../common/filters.convertor';
import { convertTrigger } from '../../common/trigger.convertor';
import {
  validateNumber,
  validateBoolean,
  validateVector2,
  validateVector3,
  validateString,
  validateStringArray,
} from '../../common/validation';

/**
 * Validates the onHit object structure
 */
const convertOnHit = (onHit: ProjectileOnHit): any => {
  if (!onHit || typeof onHit !== 'object') {
    console.error('onHit must be an object');

    return undefined;
  }

  const result: any = {};

  // Validate arrowEffect
  if (onHit.arrowEffect !== undefined) {
    if (typeof onHit.arrowEffect !== 'object') {
      console.error('arrowEffect must be an object');

      return undefined;
    }
    if (
      onHit.arrowEffect.applyEffectToBlockingTargets !== undefined &&
      !validateBoolean(
        onHit.arrowEffect.applyEffectToBlockingTargets,
        'arrowEffect.applyEffectToBlockingTargets',
      )
    ) {
      return undefined;
    }
    result.arrow_effect = onHit.arrowEffect;
  }

  // Validate definitionEvent
  if (onHit.definitionEvent !== undefined) {
    if (typeof onHit.definitionEvent !== 'object') {
      console.error('definitionEvent must be an object');

      return undefined;
    }

    result.definition_event = {};

    if (
      onHit.definitionEvent.affectProjectile !== undefined &&
      !validateBoolean(
        onHit.definitionEvent.affectProjectile,
        'definitionEvent.affectProjectile',
      )
    ) {
      return undefined;
    }

    result.definition_event.affect_projectile =
      onHit.definitionEvent.affectProjectile;

    if (
      onHit.definitionEvent.affectShooter !== undefined &&
      !validateBoolean(
        onHit.definitionEvent.affectShooter,
        'definitionEvent.affectShooter',
      )
    ) {
      return undefined;
    }

    result.definition_event.affect_shooter =
      onHit.definitionEvent.affectShooter;

    if (
      onHit.definitionEvent.affectSplashArea !== undefined &&
      !validateBoolean(
        onHit.definitionEvent.affectSplashArea,
        'definitionEvent.affectSplashArea',
      )
    ) {
      return undefined;
    }

    result.definition_event.affect_splash_area =
      onHit.definitionEvent.affectSplashArea;

    if (
      onHit.definitionEvent.affectTarget !== undefined &&
      !validateBoolean(
        onHit.definitionEvent.affectTarget,
        'definitionEvent.affectTarget',
      )
    ) {
      return undefined;
    }

    result.definition_event.affect_target = onHit.definitionEvent.affectTarget;

    if (onHit.definitionEvent.eventTrigger !== undefined) {
      const convertedEventTrigger = convertTrigger(
        onHit.definitionEvent.eventTrigger,
      );
      if (!convertedEventTrigger) {
        return undefined;
      }
      result.definition_event.event_trigger = convertedEventTrigger;
    }

    if (
      onHit.definitionEvent.splashArea !== undefined &&
      !validateNumber(
        onHit.definitionEvent.splashArea,
        'definitionEvent.splashArea',
      )
    ) {
      return undefined;
    }
    result.definition_event.splash_area = onHit.definitionEvent.splashArea;
  }

  // Validate freezeOnHit
  if (onHit.freezeOnHit !== undefined) {
    if (typeof onHit.freezeOnHit !== 'object') {
      console.error('freezeOnHit must be an object');

      return undefined;
    }
    if (
      onHit.freezeOnHit.shape !== undefined &&
      !['sphere', 'cube'].includes(onHit.freezeOnHit.shape)
    ) {
      console.error('freezeOnHit.shape must be either "sphere" or "cube"');

      return undefined;
    }
    if (
      onHit.freezeOnHit.snapToBlock !== undefined &&
      !validateBoolean(onHit.freezeOnHit.snapToBlock, 'freezeOnHit.snapToBlock')
    ) {
      return undefined;
    }
    if (
      onHit.freezeOnHit.size !== undefined &&
      !validateNumber(onHit.freezeOnHit.size, 'freezeOnHit.size')
    ) {
      return undefined;
    }
    result.freeze_on_hit = onHit.freezeOnHit;
  }

  // Validate grantXp
  if (onHit.grantXp !== undefined) {
    if (typeof onHit.grantXp !== 'object') {
      console.error('grantXp must be an object');

      return undefined;
    }
    if (
      onHit.grantXp.minXP !== undefined &&
      !validateNumber(onHit.grantXp.minXP, 'grantXp.minXP')
    ) {
      return undefined;
    }
    if (
      onHit.grantXp.maxXP !== undefined &&
      !validateNumber(onHit.grantXp.maxXP, 'grantXp.maxXP')
    ) {
      return undefined;
    }
    result.grant_xp = onHit.grantXp;
  }

  // Validate hurtOwner
  if (onHit.hurtOwner !== undefined) {
    if (typeof onHit.hurtOwner !== 'object') {
      console.error('hurtOwner must be an object');

      return undefined;
    }
    if (
      onHit.hurtOwner.ownerDamage !== undefined &&
      !validateNumber(onHit.hurtOwner.ownerDamage, 'hurtOwner.ownerDamage')
    ) {
      return undefined;
    }
    if (
      onHit.hurtOwner.knockback !== undefined &&
      !validateBoolean(onHit.hurtOwner.knockback, 'hurtOwner.knockback')
    ) {
      return undefined;
    }
    if (
      onHit.hurtOwner.ignite !== undefined &&
      !validateBoolean(onHit.hurtOwner.ignite, 'hurtOwner.ignite')
    ) {
      return undefined;
    }
    result.hurt_owner = onHit.hurtOwner;
  }

  // Validate impactDamage
  if (onHit.impactDamage !== undefined) {
    if (typeof onHit.impactDamage !== 'object') {
      console.error('impactDamage must be an object');

      return undefined;
    }
    if (
      onHit.impactDamage.catchFire !== undefined &&
      !validateBoolean(onHit.impactDamage.catchFire, 'impactDamage.catchFire')
    ) {
      return undefined;
    }
    if (
      onHit.impactDamage.channeling !== undefined &&
      !validateBoolean(onHit.impactDamage.channeling, 'impactDamage.channeling')
    ) {
      return undefined;
    }
    if (onHit.impactDamage.damage !== undefined) {
      if (!validateVector2(onHit.impactDamage.damage, 'impactDamage.damage')) {
        return undefined;
      }
    }
    if (
      onHit.impactDamage.destroyOnHit !== undefined &&
      !validateBoolean(
        onHit.impactDamage.destroyOnHit,
        'impactDamage.destroyOnHit',
      )
    ) {
      return undefined;
    }
    if (
      onHit.impactDamage.destroyOnHitRequiresDamage !== undefined &&
      !validateBoolean(
        onHit.impactDamage.destroyOnHitRequiresDamage,
        'impactDamage.destroyOnHitRequiresDamage',
      )
    ) {
      return undefined;
    }
    if (onHit.impactDamage.filter !== undefined) {
      if (!validateString(onHit.impactDamage.filter, 'impactDamage.filter')) {
        return undefined;
      }
    }
    if (
      onHit.impactDamage.knockback !== undefined &&
      !validateBoolean(onHit.impactDamage.knockback, 'impactDamage.knockback')
    ) {
      return undefined;
    }
    if (
      onHit.impactDamage.maxCriticalDamage !== undefined &&
      !validateNumber(
        onHit.impactDamage.maxCriticalDamage,
        'impactDamage.maxCriticalDamage',
      )
    ) {
      return undefined;
    }
    if (
      onHit.impactDamage.minCriticalDamage !== undefined &&
      !validateNumber(
        onHit.impactDamage.minCriticalDamage,
        'impactDamage.minCriticalDamage',
      )
    ) {
      return undefined;
    }
    if (
      onHit.impactDamage.powerMultiplier !== undefined &&
      !validateNumber(
        onHit.impactDamage.powerMultiplier,
        'impactDamage.powerMultiplier',
      )
    ) {
      return undefined;
    }
    if (
      onHit.impactDamage.semiRandomDiffDamage !== undefined &&
      !validateBoolean(
        onHit.impactDamage.semiRandomDiffDamage,
        'impactDamage.semiRandomDiffDamage',
      )
    ) {
      return undefined;
    }
    if (
      onHit.impactDamage.setLastHurtRequiresDamage !== undefined &&
      !validateBoolean(
        onHit.impactDamage.setLastHurtRequiresDamage,
        'impactDamage.setLastHurtRequiresDamage',
      )
    ) {
      return undefined;
    }

    result.impact_damage = onHit.impactDamage;
  }

  // Validate mobEffect
  if (onHit.mobEffect !== undefined) {
    if (typeof onHit.mobEffect !== 'object') {
      console.error('mobEffect must be an object');

      return undefined;
    }
    if (
      onHit.mobEffect.ambient !== undefined &&
      !validateBoolean(onHit.mobEffect.ambient, 'mobEffect.ambient')
    ) {
      return undefined;
    }
    if (
      onHit.mobEffect.amplifier !== undefined &&
      !validateNumber(onHit.mobEffect.amplifier, 'mobEffect.amplifier')
    ) {
      return undefined;
    }
    if (
      onHit.mobEffect.duration !== undefined &&
      typeof onHit.mobEffect.duration !== 'number' &&
      onHit.mobEffect.duration !== 'infinite'
    ) {
      console.error('mobEffect.duration must be a number or "infinite"');

      return undefined;
    }
    if (
      onHit.mobEffect.effect !== undefined &&
      typeof onHit.mobEffect.effect !== 'string'
    ) {
      console.error('mobEffect.effect must be a string');

      return undefined;
    }
    if (
      onHit.mobEffect.visible !== undefined &&
      !validateBoolean(onHit.mobEffect.visible, 'mobEffect.visible')
    ) {
      return undefined;
    }
    result.mob_effect = onHit.mobEffect;
  }

  // Validate particleOnHit
  if (onHit.particleOnHit !== undefined) {
    if (typeof onHit.particleOnHit !== 'object') {
      console.error('particleOnHit must be an object');

      return undefined;
    }
    if (
      onHit.particleOnHit.numParticles !== undefined &&
      !validateNumber(
        onHit.particleOnHit.numParticles,
        'particleOnHit.numParticles',
      )
    ) {
      return undefined;
    }
    if (
      onHit.particleOnHit.onEntityHit !== undefined &&
      !validateBoolean(
        onHit.particleOnHit.onEntityHit,
        'particleOnHit.onEntityHit',
      )
    ) {
      return undefined;
    }
    if (
      onHit.particleOnHit.onOtherHit !== undefined &&
      !validateBoolean(
        onHit.particleOnHit.onOtherHit,
        'particleOnHit.onOtherHit',
      )
    ) {
      return undefined;
    }
    if (
      onHit.particleOnHit.particleType !== undefined &&
      typeof onHit.particleOnHit.particleType !== 'string'
    ) {
      console.error('particleOnHit.particleType must be a string');

      return undefined;
    }
    result.particle_on_hit = onHit.particleOnHit;
  }

  // Validate spawnAoeCloud
  if (onHit.spawnAoeCloud !== undefined) {
    if (typeof onHit.spawnAoeCloud !== 'object') {
      console.error('spawnAoeCloud must be an object');

      return undefined;
    }
    if (
      onHit.spawnAoeCloud.affectOwner !== undefined &&
      !validateBoolean(
        onHit.spawnAoeCloud.affectOwner,
        'spawnAoeCloud.affectOwner',
      )
    ) {
      return undefined;
    }
    if (onHit.spawnAoeCloud.color !== undefined) {
      if (!validateVector3(onHit.spawnAoeCloud.color, 'spawnAoeCloud.color')) {
        return undefined;
      }
      result.spawn_aoe_cloud.color = onHit.spawnAoeCloud.color;
    }
    if (
      onHit.spawnAoeCloud.duration !== undefined &&
      !validateNumber(onHit.spawnAoeCloud.duration, 'spawnAoeCloud.duration')
    ) {
      return undefined;
    }
    if (
      !validateString(onHit.spawnAoeCloud.particle, 'spawnAoeCloud.particle')
    ) {
      return undefined;
    }
    if (
      onHit.spawnAoeCloud.potion !== undefined &&
      !validateNumber(onHit.spawnAoeCloud.potion, 'spawnAoeCloud.potion')
    ) {
      return undefined;
    }
    if (
      onHit.spawnAoeCloud.radius !== undefined &&
      !validateNumber(onHit.spawnAoeCloud.radius, 'spawnAoeCloud.radius')
    ) {
      return undefined;
    }
    if (
      onHit.spawnAoeCloud.radiusOnUse !== undefined &&
      !validateNumber(
        onHit.spawnAoeCloud.radiusOnUse,
        'spawnAoeCloud.radiusOnUse',
      )
    ) {
      return undefined;
    }
    if (
      onHit.spawnAoeCloud.reapplicationDelay !== undefined &&
      !validateNumber(
        onHit.spawnAoeCloud.reapplicationDelay,
        'spawnAoeCloud.reapplicationDelay',
      )
    ) {
      return undefined;
    }
    result.spawn_aoe_cloud = onHit.spawnAoeCloud;
  }

  // Validate spawnChance
  if (onHit.spawnChance !== undefined) {
    if (typeof onHit.spawnChance !== 'object') {
      console.error('spawnChance must be an object');

      return undefined;
    }
    if (
      onHit.spawnChance.firstSpawnCount !== undefined &&
      !validateNumber(
        onHit.spawnChance.firstSpawnCount,
        'spawnChance.firstSpawnCount',
      )
    ) {
      return undefined;
    }
    if (
      onHit.spawnChance.firstSpawnPercentChance !== undefined &&
      !validateNumber(
        onHit.spawnChance.firstSpawnPercentChance,
        'spawnChance.firstSpawnPercentChance',
      )
    ) {
      return undefined;
    }
    if (
      onHit.spawnChance.firstSpawnChance !== undefined &&
      !validateNumber(
        onHit.spawnChance.firstSpawnChance,
        'spawnChance.firstSpawnChance',
      )
    ) {
      return undefined;
    }
    if (
      onHit.spawnChance.secondSpawnChance !== undefined &&
      !validateNumber(
        onHit.spawnChance.secondSpawnChance,
        'spawnChance.secondSpawnChance',
      )
    ) {
      return undefined;
    }
    if (
      onHit.spawnChance.secondSpawnCount !== undefined &&
      !validateNumber(
        onHit.spawnChance.secondSpawnCount,
        'spawnChance.secondSpawnCount',
      )
    ) {
      return undefined;
    }
    if (
      onHit.spawnChance.spawnBaby !== undefined &&
      !validateBoolean(onHit.spawnChance.spawnBaby, 'spawnChance.spawnBaby')
    ) {
      return undefined;
    }
    if (
      !validateString(
        onHit.spawnChance.spawnDefinition,
        'spawnChance.spawnDefinition',
      )
    ) {
      return undefined;
    }
    if (onHit.spawnChance.onSpawn !== undefined) {
      const convertedOnSpawn = onHit.spawnChance.onSpawn
        .map((trigger) => convertTrigger(trigger))
        .filter(Boolean);
      if (!convertedOnSpawn.length) {
        return undefined;
      }
      result.spawn_chance.on_spawn = convertedOnSpawn;
    }
  }

  // Validate stickInGround
  if (onHit.stickInGround !== undefined) {
    const stickInGround: any = {};
    if (onHit.stickInGround.shakeTime !== undefined) {
      if (
        !validateNumber(
          onHit.stickInGround.shakeTime,
          'stickInGround.shakeTime',
        )
      ) {
        return undefined;
      }
      stickInGround.shake_time = onHit.stickInGround.shakeTime;
    }

    result.stick_in_ground = stickInGround;
  }

  return result;
};

/**
 * Converts a ProjectileComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertProjectileComponent = (
  component: Partial<ProjectileComponent>,
): { 'minecraft:projectile': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate anchor
  if (component.anchor !== undefined) {
    if (![0, 1, 2].includes(component.anchor)) {
      console.error('anchor must be 0, 1, or 2');

      return undefined;
    }
    result.anchor = component.anchor;
  }

  // Validate angleOffset
  if (component.angleOffset !== undefined) {
    if (!validateNumber(component.angleOffset, 'angleOffset')) {
      return undefined;
    }
    result.angle_offset = component.angleOffset;
  }

  // Validate catchFire
  if (component.catchFire !== undefined) {
    if (!validateBoolean(component.catchFire, 'catchFire')) {
      return undefined;
    }
    result.catch_fire = component.catchFire;
  }

  // Validate critParticleOnHurt
  if (component.critParticleOnHurt !== undefined) {
    if (!validateBoolean(component.critParticleOnHurt, 'critParticleOnHurt')) {
      return undefined;
    }
    result.crit_particle_on_hurt = component.critParticleOnHurt;
  }

  // Validate destroyOnHurt
  if (component.destroyOnHurt !== undefined) {
    if (!validateBoolean(component.destroyOnHurt, 'destroyOnHurt')) {
      return undefined;
    }
    result.destroy_on_hurt = component.destroyOnHurt;
  }

  // Validate filter
  if (component.filter !== undefined) {
    const convertedFilter = convertEntityFilters(component.filter);
    if (!convertedFilter) {
      return undefined;
    }
    result.filter = convertedFilter;
  }

  // Validate fireAffectedByGriefing
  if (component.fireAffectedByGriefing !== undefined) {
    if (
      !validateBoolean(
        component.fireAffectedByGriefing,
        'fireAffectedByGriefing',
      )
    ) {
      return undefined;
    }
    result.fire_affected_by_griefing = component.fireAffectedByGriefing;
  }

  // Validate gravity
  if (component.gravity !== undefined) {
    if (!validateNumber(component.gravity, 'gravity')) {
      return undefined;
    }
    result.gravity = component.gravity;
  }

  // Validate hitNearestPassenger
  if (component.hitNearestPassenger !== undefined) {
    if (
      !validateBoolean(component.hitNearestPassenger, 'hitNearestPassenger')
    ) {
      return undefined;
    }
    result.hit_nearest_passenger = component.hitNearestPassenger;
  }

  // Validate ignoredEntities
  if (component.ignoredEntities !== undefined) {
    if (!validateStringArray(component.ignoredEntities, 'ignoredEntities')) {
      return undefined;
    }
    result.ignored_entities = component.ignoredEntities;
  }

  // Validate hitGroundSound
  if (component.hitGroundSound !== undefined) {
    if (!validateString(component.hitGroundSound, 'hitGroundSound')) {
      return undefined;
    }
    result.hit_ground_sound = component.hitGroundSound;
  }

  // Validate hitSound
  if (component.hitSound !== undefined) {
    if (!validateString(component.hitSound, 'hitSound')) {
      return undefined;
    }
    result.hit_sound = component.hitSound;
  }

  // Validate homing
  if (component.homing !== undefined) {
    if (!validateBoolean(component.homing, 'homing')) {
      return undefined;
    }
    result.homing = component.homing;
  }

  // Validate inertia
  if (component.inertia !== undefined) {
    if (!validateNumber(component.inertia, 'inertia')) {
      return undefined;
    }
    result.inertia = component.inertia;
  }

  // Validate isDangerous
  if (component.isDangerous !== undefined) {
    if (!validateBoolean(component.isDangerous, 'isDangerous')) {
      return undefined;
    }
    result.is_dangerous = component.isDangerous;
  }

  // Validate knockback
  if (component.knockback !== undefined) {
    if (!validateBoolean(component.knockback, 'knockback')) {
      return undefined;
    }
    result.knockback = component.knockback;
  }

  // Validate lightning
  if (component.lightning !== undefined) {
    if (!validateBoolean(component.lightning, 'lightning')) {
      return undefined;
    }
    result.lightning = component.lightning;
  }

  // Validate liquidInertia
  if (component.liquidInertia !== undefined) {
    if (!validateNumber(component.liquidInertia, 'liquidInertia')) {
      return undefined;
    }
    result.liquid_inertia = component.liquidInertia;
  }

  // Validate multipleTargets
  if (component.multipleTargets !== undefined) {
    if (!validateBoolean(component.multipleTargets, 'multipleTargets')) {
      return undefined;
    }
    result.multiple_targets = component.multipleTargets;
  }

  // Validate offset
  if (component.offset !== undefined) {
    if (!validateVector3(component.offset, 'offset')) {
      return undefined;
    }
    result.offset = component.offset;
  }

  // Validate onFireTime
  if (component.onFireTime !== undefined) {
    if (!validateNumber(component.onFireTime, 'onFireTime')) {
      return undefined;
    }
    result.on_fire_time = component.onFireTime;
  }

  // Validate onHit
  if (component.onHit !== undefined) {
    const convertedOnHit = convertOnHit(component.onHit);
    if (!convertedOnHit) {
      return undefined;
    }
    result.on_hit = convertedOnHit;
  }

  // Validate particle
  if (component.particle !== undefined) {
    if (typeof component.particle !== 'string') {
      console.error('particle must be a string');

      return undefined;
    }
    result.particle = component.particle;
  }

  // Validate potionEffect
  if (component.potionEffect !== undefined) {
    if (!validateNumber(component.potionEffect, 'potionEffect')) {
      return undefined;
    }
    result.potion_effect = component.potionEffect;
  }

  // Validate power
  if (component.power !== undefined) {
    if (!validateNumber(component.power, 'power')) {
      return undefined;
    }
    result.power = component.power;
  }

  // Validate reflectImmunity
  if (component.reflectImmunity !== undefined) {
    if (!validateNumber(component.reflectImmunity, 'reflectImmunity')) {
      return undefined;
    }
    result.reflect_immunity = component.reflectImmunity;
  }

  // Validate reflectOnHurt
  if (component.reflectOnHurt !== undefined) {
    if (!validateBoolean(component.reflectOnHurt, 'reflectOnHurt')) {
      return undefined;
    }
    result.reflect_on_hurt = component.reflectOnHurt;
  }

  // Validate semiRandomDiffDamage
  if (component.semiRandomDiffDamage !== undefined) {
    if (
      !validateBoolean(component.semiRandomDiffDamage, 'semiRandomDiffDamage')
    ) {
      return undefined;
    }
    result.semi_random_diff_damage = component.semiRandomDiffDamage;
  }

  // Validate shootSound
  if (component.shootSound !== undefined) {
    if (typeof component.shootSound !== 'string') {
      console.error('shootSound must be a string');

      return undefined;
    }
    result.shoot_sound = component.shootSound;
  }

  // Validate shootTarget
  if (component.shootTarget !== undefined) {
    if (!validateBoolean(component.shootTarget, 'shootTarget')) {
      return undefined;
    }
    result.shoot_target = component.shootTarget;
  }

  // Validate shouldBounce
  if (component.shouldBounce !== undefined) {
    if (!validateBoolean(component.shouldBounce, 'shouldBounce')) {
      return undefined;
    }
    result.should_bounce = component.shouldBounce;
  }

  // Validate splashPotion
  if (component.splashPotion !== undefined) {
    if (!validateBoolean(component.splashPotion, 'splashPotion')) {
      return undefined;
    }
    result.splash_potion = component.splashPotion;
  }

  // Validate splashRange
  if (component.splashRange !== undefined) {
    if (!validateNumber(component.splashRange, 'splashRange')) {
      return undefined;
    }
    result.splash_range = component.splashRange;
  }

  // Validate stopOnHurt
  if (component.stopOnHurt !== undefined) {
    if (!validateBoolean(component.stopOnHurt, 'stopOnHurt')) {
      return undefined;
    }
    result.stop_on_hurt = component.stopOnHurt;
  }

  // Validate uncertaintyBase
  if (component.uncertaintyBase !== undefined) {
    if (!validateNumber(component.uncertaintyBase, 'uncertaintyBase')) {
      return undefined;
    }
    result.uncertainty_base = component.uncertaintyBase;
  }

  // Validate uncertaintyMultiplier
  if (component.uncertaintyMultiplier !== undefined) {
    if (
      !validateNumber(component.uncertaintyMultiplier, 'uncertaintyMultiplier')
    ) {
      return undefined;
    }
    result.uncertainty_multiplier = component.uncertaintyMultiplier;
  }

  return {
    'minecraft:projectile': result,
  };
};

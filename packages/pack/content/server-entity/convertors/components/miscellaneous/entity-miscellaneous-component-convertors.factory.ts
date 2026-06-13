import { convertAgeableComponent } from './ageable-component.convertor';
import { convertAmbientSoundIntervalComponent } from './ambient-sound-interval-component.convertor';
import { convertAnnotationBreakDoorComponent } from './annotation-break-door-component.convertor';
import { convertAnnotationOpenDoorComponent } from './annotation-open-door-component.convertor';
import { convertBalloonableComponent } from './balloonable-component.convertor';
import { convertBreakBlocksComponent } from './break-blocks-component.convertor';
import { convertBreathableComponent } from './breathable-component.convertor';
import { convertBurnsInDaylightComponent } from './burns-in-daylight-component.convertor';
import { convertConditionalBandwidthOptimizationComponent } from './conditional-bandwidth-optimization-component.convertor';
import { convertDefaultLookAngleComponent } from './default-look-angle-component.convertor';
import { convertDespawnComponent } from './despawn-component.convertor';
import { convertDimensionBoundComponent } from './dimension-bound-component.convertor';
import { convertExhaustionValuesComponent } from './exhaustion-values-component.convertor';
import { convertExperienceRewardComponent } from './experience-reward-component.convertor';
import { convertExplodeComponent } from './explode-component.convertor';
import { convertFallDamageComponent } from './fall-damage-component.convertor';
import { convertFireImmuneComponent } from './fire-immune-component.convertor';
import { convertGameEventMovementTrackingComponent } from './game-event-movement-tracking-component.convertor';
import { convertGeneticsComponent } from './genetics-component.convertor';
import { convertGroundOffsetComponent } from './ground-offset-component.convertor';
import { convertGrowsCropComponent } from './grows-crop-component.convertor';
import { convertHealableComponent } from './healable-component.convertor';
import { convertHeartbeatComponent } from './heartbeat-component.convertor';
import { convertHideComponent } from './hide-component.convertor';
import { convertHomeComponent } from './home-component.convertor';
import { convertHurtOnConditionComponent } from './hurt-on-condition-component.convertor';
import { convertHurtWhenWetComponent } from './hurt-when-wet-component.convertor';
import { convertInsomniaComponent } from './insomnia-component.convertor';
import { convertInstantDespawnComponent } from './instant-despawn-component.convertor';
import { convertLookedAtComponent } from './looked-at-component.convertor';
import { convertLootComponent } from './loot-component.convertor';
import { convertMovementSoundDistanceOffsetComponent } from './movement-sound-distance-offset-component.convertor';
import { convertNameableComponent } from './nameable-component.convertor';
import { convertPeekComponent } from './peek-component.convertor';
import { convertPlayerExhaustionComponent } from './player-exhaustion-component.convertor';
import { convertPlayerExperienceComponent } from './player-experience-component.convertor';
import { convertPlayerLevelComponent } from './player-level-component.convertor';
import { convertPlayerSaturationComponent } from './player-saturation-component.convertor';
import { convertPreferredPathComponent } from './preferred-path-component.convertor';
import { convertRaidTriggerComponent } from './raid-trigger-component.convertor';
import { convertRavagerBlockedComponent } from './ravager-blocked-component.convertor';
import { convertRemoveInPeacefulComponent } from './remove-in-peaceful-component.convertor';
import { convertRendersWhenInvisibleComponent } from './renders-when-invisible-component.convertor';
import { convertScaffoldingClimberComponent } from './scaffolding-climber-component.convertor';
import { convertShareablesComponent } from './shareables-component.convertor';
import { convertSoundVolumeComponent } from './sound-volume-component.convertor';
import { convertSpawnEntityComponent } from './spawn-entity-component.convertor';
import { convertSpawnOnDeathComponent } from './spawn-on-death-component.convertor';
import { convertSpellEffectsComponent } from './spell-effects-component.convertor';
import { convertStrengthComponent } from './strength-component.convertor';
import { convertSuspectTrackingComponent } from './suspect-tracking-component.convertor';
import { convertTeleportComponent } from './teleport-component.convertor';
import { convertTickWorldComponent } from './tick-world.convertor';
import { convertTrailComponent } from './trail-component.convertor';
import { convertTransientComponent } from './transient-component.convertor';
import { convertVariableMaxAutoStepComponent } from './variable-max-auto-step-component.convertor';
import { convertVibrationDamperComponent } from './vibration-damper-component.convertor';
import { convertVibrationListenerComponent } from './vibration-listener-component.convertor';
import { convertWantsJockeyComponent } from './wants-jockey-component.convertor';

export const entityMiscellaneousComponentConvertorsFactory = {
  ageable: convertAgeableComponent,
  ambientSoundInterval: convertAmbientSoundIntervalComponent,
  annotationBreakDoor: convertAnnotationBreakDoorComponent,
  annotationOpenDoor: convertAnnotationOpenDoorComponent,
  balloonable: convertBalloonableComponent,
  breakBlocks: convertBreakBlocksComponent,
  breathable: convertBreathableComponent,
  burnsInDaylight: convertBurnsInDaylightComponent,
  conditionalBandwidthOptimization: convertConditionalBandwidthOptimizationComponent,
  defaultLookAngle: convertDefaultLookAngleComponent,
  despawn: convertDespawnComponent,
  dimensionBound: convertDimensionBoundComponent,
  exhaustionValues: convertExhaustionValuesComponent,
  experienceReward: convertExperienceRewardComponent,
  explode: convertExplodeComponent,
  fallDamage: convertFallDamageComponent,
  fireImmune: convertFireImmuneComponent,
  gameEventMovementTracking: convertGameEventMovementTrackingComponent,
  genetics: convertGeneticsComponent,
  groundOffset: convertGroundOffsetComponent,
  growsCrop: convertGrowsCropComponent,
  healable: convertHealableComponent,
  heartbeat: convertHeartbeatComponent,
  hide: convertHideComponent,
  home: convertHomeComponent,
  hurtOnCondition: convertHurtOnConditionComponent,
  hurtWhenWet: convertHurtWhenWetComponent,
  insomnia: convertInsomniaComponent,
  instantDespawn: convertInstantDespawnComponent,
  lookedAt: convertLookedAtComponent,
  loot: convertLootComponent,
  movementSoundDistanceOffset: convertMovementSoundDistanceOffsetComponent,
  nameable: convertNameableComponent,
  peek: convertPeekComponent,
  playerExhaustion: convertPlayerExhaustionComponent,
  playerExperience: convertPlayerExperienceComponent,
  playerLevel: convertPlayerLevelComponent,
  playerSaturation: convertPlayerSaturationComponent,
  preferredPath: convertPreferredPathComponent,
  raidTrigger: convertRaidTriggerComponent,
  ravagerBlocked: convertRavagerBlockedComponent,
  removeInPeaceful: convertRemoveInPeacefulComponent,
  rendersWhenInvisible: convertRendersWhenInvisibleComponent,
  scaffoldingClimber: convertScaffoldingClimberComponent,
  shareables: convertShareablesComponent,
  soundVolume: convertSoundVolumeComponent,
  spawnEntity: convertSpawnEntityComponent,
  spawnOnDeath: convertSpawnOnDeathComponent,
  spellEffects: convertSpellEffectsComponent,
  strength: convertStrengthComponent,
  suspectTracking: convertSuspectTrackingComponent,
  teleport: convertTeleportComponent,
  tickWorld: convertTickWorldComponent,
  trail: convertTrailComponent,
  transient: convertTransientComponent,
  variableMaxAutoStep: convertVariableMaxAutoStepComponent,
  vibrationDamper: convertVibrationDamperComponent,
  vibrationListener: convertVibrationListenerComponent,
  wantsJockey: convertWantsJockeyComponent
};

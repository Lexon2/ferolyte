import {
  AgeableComponent,
  AnnotationBreakDoorComponent,
  AmbientSoundIntervalComponent,
  AnnotationOpenDoorComponent,
  BalloonableComponent,
  BreakBlocksComponent,
  BreathableComponent,
  BurnsInDaylightComponent,
  ConditionalBandwidthOptimizationComponent,
  DefaultLookAngleComponent,
  DespawnComponent,
  DimensionBoundComponent,
  ExhaustionValuesComponent,
  ExperienceRewardComponent,
  ExplodeComponent,
  FallDamageComponent,
  FireImmuneComponent,
  GameEventMovementTrackingComponent,
  GeneticsComponent,
  GroundOffsetComponent,
  GrowsCropComponent,
  HealableComponent,
  HeartbeatComponent,
  HideComponent,
  HomeComponent,
  HurtOnConditionComponent,
  HurtWhenWetComponent,
  InsomniaComponent,
  InstantDespawnComponent,
  LookedAtComponent,
  LootComponent,
  MovementSoundDistanceOffsetComponent,
  NameableComponent,
  PeekComponent,
  PlayerExhaustionComponent,
  PlayerExperienceComponent,
  PlayerLevelComponent,
  PlayerSaturationComponent,
  PreferredPathComponent,
  RaidTriggerComponent,
  RavagerBlockedComponent,
  RemoveInPeacefulComponent,
  RendersWhenInvisibleComponent,
  ScaffoldingClimberComponent,
  ShareablesComponent,
  SoundVolumeComponent,
  SpawnEntityComponent,
  SpawnOnDeathComponent,
  StrengthComponent,
  SpellEffectsComponent,
  SuspectTrackingComponent,
  TeleportComponent,
  TickWorldComponent,
  TrailComponent,
  TransientComponent,
  VariableMaxAutoStepComponent,
  VibrationDamperComponent,
  VibrationListenerComponent,
  WantsJockeyComponent,
} from './miscellaneous';

export interface EntityMiscellaneousComponents {
  ageable?: AgeableComponent;
  annotationBreakDoor?: AnnotationBreakDoorComponent;
  ambientSoundInterval?: AmbientSoundIntervalComponent;
  annotationOpenDoor?: AnnotationOpenDoorComponent;
  balloonable?: BalloonableComponent;
  breakBlocks?: BreakBlocksComponent;
  breathable?: BreathableComponent;
  burnsInDaylight?: BurnsInDaylightComponent;
  conditionalBandwidthOptimization?: ConditionalBandwidthOptimizationComponent;
  defaultLookAngle?: DefaultLookAngleComponent;
  despawn?: DespawnComponent;
  dimensionBound?: DimensionBoundComponent;
  exhaustionValues?: ExhaustionValuesComponent;
  experienceReward?: ExperienceRewardComponent;
  explode?: ExplodeComponent;
  fallDamage?: FallDamageComponent;
  fireImmune?: FireImmuneComponent;
  gameEventMovementTracking?: GameEventMovementTrackingComponent;
  genetics?: GeneticsComponent;
  groundOffset?: GroundOffsetComponent;
  growsCrop?: GrowsCropComponent;
  healable?: HealableComponent;
  heartbeat?: HeartbeatComponent;
  hide?: HideComponent;
  home?: HomeComponent;
  hurtOnCondition?: HurtOnConditionComponent;
  hurtWhenWet?: HurtWhenWetComponent;
  insomnia?: InsomniaComponent;
  instantDespawn?: InstantDespawnComponent;
  lookedAt?: LookedAtComponent;
  loot?: LootComponent;
  movementSoundDistanceOffset?: MovementSoundDistanceOffsetComponent;
  nameable?: NameableComponent;
  peek?: PeekComponent;
  playerExhaustion?: PlayerExhaustionComponent;
  playerExperience?: PlayerExperienceComponent;
  playerLevel?: PlayerLevelComponent;
  playerSaturation?: PlayerSaturationComponent;
  preferredPath?: PreferredPathComponent;
  raidTrigger?: RaidTriggerComponent;
  ravagerBlocked?: RavagerBlockedComponent;
  removeInPeaceful?: RemoveInPeacefulComponent;
  rendersWhenInvisible?: RendersWhenInvisibleComponent;
  scaffoldingClimber?: ScaffoldingClimberComponent;
  shareables?: ShareablesComponent;
  soundVolume?: SoundVolumeComponent;
  spawnEntity?: SpawnEntityComponent;
  spawnOnDeath?: SpawnOnDeathComponent;
  strength?: StrengthComponent;
  spellEffects?: SpellEffectsComponent;
  suspectTracking?: SuspectTrackingComponent;
  teleport?: TeleportComponent;
  tickWorld?: TickWorldComponent;
  trail?: TrailComponent;
  transient?: TransientComponent;
  variableMaxAutoStep?: VariableMaxAutoStepComponent;
  vibrationDamper?: VibrationDamperComponent;
  vibrationListener?: VibrationListenerComponent;
  wantsJockey?: WantsJockeyComponent;
}

import {
  AdmireItemBehavior,
  AvoidBlockBehavior,
  AvoidMobTypeBehavior,
  BarterBehavior,
  BegBehavior,
  BreakDoorBehavior,
  BreedBehavior,
  CelebrateBehavior,
  CelebrateSurviveBehavior,
  ChargeAttackBehavior,
  ChargeHeldItemBehavior,
  CircleAroundAnchorBehavior,
  ControlledByPlayerBehavior,
  CroakBehavior,
  DefendTrustedTargetBehavior,
  DefendVillageTargetBehavior,
  DelayedAttackBehavior,
  DigBehavior,
  DoorInteractBehavior,
  DragonDeathBehavior,
  DragonFlamingBehavior,
  DragonHoldingPatternBehavior,
  DragonLandingBehavior,
  DragonScanningBehavior,
  DragonStrafePlayerBehavior,
  DragonTakeoffBehavior,
  DragonChargePlayerBehavior,
  DrinkMilkBehavior,
  DrinkPotionBehavior,
  DropItemForBehavior,
  EatBlockBehavior,
  EatCarriedItemBehavior,
  EatMobBehavior,
  EmergeBehavior,
  EndermanLeaveBlockBehavior,
  EndermanTakeBlockBehavior,
  EquipItemBehavior,
  ExploreOutskirtsBehavior,
  FertilizeFarmBlockBehavior,
  FindCoverBehavior,
  FindMountBehavior,
  FindUnderwaterTreasureBehavior,
  FireAtTargetBehavior,
  FleeSunBehavior,
  FloatBehavior,
  FloatTemptBehavior,
  FloatWanderBehavior,
  FollowCaravanBehavior,
  FollowMobBehavior,
  FollowOwnerBehavior,
  FollowParentBehavior,
  FollowTargetCaptainBehavior,
  FollowTargetLeaderBehavior,
  GoAndGiveItemsToNoteblockBehavior,
  GoAndGiveItemsToOwnerBehavior,
  GoHomeBehavior,
  GuardianAttackBehavior,
  HarvestFarmBlockBehavior,
  HideBehavior,
  HoldGroundBehavior,
  HurtByTargetBehavior,
  InspectBookshelfBehavior,
  InvestigateSuspiciousLocationBehavior,
  JumpAroundTargetBehavior,
  JumpToBlockBehavior,
  KnockbackRoarBehavior,
  LayDownBehavior,
  LayEggBehavior,
  LeapAtTargetBehavior,
  LookAtEntityBehavior,
  LookAtPlayerBehavior,
  LookAtTargetBehavior,
  LookAtTradingPlayerBehavior,
  MakeLoveBehavior,
  MeleeAttackBehavior,
  MeleeBoxAttackBehavior,
  MingleBehavior,
  MountPathingBehavior,
  MoveAroundTargetBehavior,
  MoveIndoorsBehavior,
  MoveOutdoorsBehavior,
  MoveThroughVillageBehavior,
  MoveToBlockBehavior,
  MoveToLandBehavior,
  MoveToLavaBehavior,
  MoveToLiquidBehavior,
  MoveToPoiBehavior,
  MoveToRandomBlockBehavior,
  MoveToVillageBehavior,
  MoveToWaterBehavior,
  MoveTowardsDwellingRestrictionBehavior,
  MoveTowardsHomeRestrictionBehavior,
  MoveTowardsRestrictionBehavior,
  MoveTowardsTargetBehavior,
  NapBehavior,
  NearestAttackableTargetBehavior,
  NearestPrioritizedAttackableTargetBehavior,
  OcelotAttackBehavior,
  OcelotSitOnBlockBehavior,
  OfferFlowerBehavior,
  OpenDoorBehavior,
  OwnerHurtByTargetBehavior,
  OwnerHurtTargetBehavior,
  PanicBehavior,
  PetSleepWithOwnerBehavior,
  PickupItemsBehavior,
  PlaceBlockBehavior,
  PlayBehavior,
  PlayDeadBehavior,
  PlayerRideTamedBehavior,
  RaidGardenBehavior,
  RamAttackBehavior,
  RandomBreachBehavior,
  RandomFlyBehavior,
  RandomHoverBehavior,
  RandomLookAroundAndSitBehavior,
  RandomLookAroundBehavior,
  RandomSearchAndDigBehavior,
  RandomSittingBehavior,
  RandomStrollBehavior,
  RandomSwimBehavior,
  RangedAttackBehavior,
  ReceiveLoveBehavior,
  RestrictOpenDoorBehavior,
  RestrictSunBehavior,
  RiseToLiquidLevelBehavior,
  RoarBehavior,
  RollBehavior,
  RunAroundLikeCrazyBehavior,
  ScaredBehavior,
  SendEventBehavior,
  ShareItemsBehavior,
  SilverfishMergeWithStoneBehavior,
  SilverfishWakeUpFriendsBehavior,
  SkeletonHorseTrapBehavior,
  SleepBehavior,
  SlimeAttackBehavior,
  SlimeFloatBehavior,
  SlimeKeepOnJumpingBehavior,
  SlimeRandomDirectionBehavior,
  SnackingBehavior,
  SneezeBehavior,
  SniffBehavior,
  SonicBoomBehavior,
  SquidDiveBehavior,
  SquidFleeBehavior,
  SquidIdleBehavior,
  SquidMoveAwayFromGroundBehavior,
  SquidOutOfWaterBehavior,
  StalkAndPounceOnTargetBehavior,
  StayNearNoteBlockBehavior,
  StayWhileSittingBehavior,
  StompAttackBehavior,
  StompTurtleEggBehavior,
  StrollTowardsVillageBehavior,
  SummonEntityBehavior,
  SwellBehavior,
  SwimIdleBehavior,
  SwimUpForBreathBehavior,
  SwimWanderBehavior,
  SwimWithEntityBehavior,
  SwoopAttackBehavior,
  TakeBlockBehavior,
  TakeFlowerBehavior,
  TargetWhenPushedBehavior,
  TeleportToOwnerBehavior,
  TemptBehavior,
  TimerFlag1Behavior,
  TimerFlag2Behavior,
  TimerFlag3Behavior,
  TradeInterestBehavior,
  TradeWithPlayerBehavior,
  TransportItemsBehavior,
  UseKineticWeaponBehavior,
  VexCopyOwnerTargetBehavior,
  VexRandomMoveBehavior,
  WitherRandomAttackPosGoalBehavior,
  WitherTargetHighestDamageBehavior,
  WorkBehavior,
  WorkComposterBehavior,
} from './behaviors';

export interface EntityBehaviors {
  admireItem: AdmireItemBehavior;
  avoidBlock: AvoidBlockBehavior;
  avoidMobType: AvoidMobTypeBehavior;
  barter: BarterBehavior;
  beg: BegBehavior;
  breakDoor: BreakDoorBehavior;
  breed: BreedBehavior;
  celebrate: CelebrateBehavior;
  celebrateSurvive: CelebrateSurviveBehavior;
  chargeAttack: ChargeAttackBehavior;
  chargeHeldItem: ChargeHeldItemBehavior;
  circleAroundAnchor: CircleAroundAnchorBehavior;
  controlledByPlayer: ControlledByPlayerBehavior;
  croak: CroakBehavior;
  defendTrustedTarget: DefendTrustedTargetBehavior;
  defendVillageTarget: DefendVillageTargetBehavior;
  delayedAttack: DelayedAttackBehavior;
  dig: DigBehavior;
  doorInteract: DoorInteractBehavior;
  dragonDeath: DragonDeathBehavior;
  dragonFlaming: DragonFlamingBehavior;
  dragonHoldingPattern: DragonHoldingPatternBehavior;
  dragonLanding: DragonLandingBehavior;
  dragonScanning: DragonScanningBehavior;
  dragonStrafePlayer: DragonStrafePlayerBehavior;
  dragonTakeoff: DragonTakeoffBehavior;
  dragonChargePlayer: DragonChargePlayerBehavior;
  drinkMilk: DrinkMilkBehavior;
  drinkPotion: DrinkPotionBehavior;
  dropItemFor: DropItemForBehavior;
  eatBlock: EatBlockBehavior;
  eatCarriedItem: EatCarriedItemBehavior;
  eatMob: EatMobBehavior;
  emerge: EmergeBehavior;
  endermanLeaveBlock: EndermanLeaveBlockBehavior;
  endermanTakeBlock: EndermanTakeBlockBehavior;
  equipItem: EquipItemBehavior;
  exploreOutskirts: ExploreOutskirtsBehavior;
  fertilizeFarmBlock: FertilizeFarmBlockBehavior;
  findCover: FindCoverBehavior;
  findMount: FindMountBehavior;
  findUnderwaterTreasure: FindUnderwaterTreasureBehavior;
  fireAtTarget: FireAtTargetBehavior;
  fleeSun: FleeSunBehavior;
  float: FloatBehavior;
  floatTempt: FloatTemptBehavior;
  floatWander: FloatWanderBehavior;
  followCaravan: FollowCaravanBehavior;
  followMob: FollowMobBehavior;
  followOwner: FollowOwnerBehavior;
  followParent: FollowParentBehavior;
  followTargetCaptain: FollowTargetCaptainBehavior;
  followTargetLeader: FollowTargetLeaderBehavior;
  goAndGiveItemsToNoteblock: GoAndGiveItemsToNoteblockBehavior;
  goAndGiveItemsToOwner: GoAndGiveItemsToOwnerBehavior;
  goHome: GoHomeBehavior;
  guardianAttack: GuardianAttackBehavior;
  harvestFarmBlock: HarvestFarmBlockBehavior;
  hide: HideBehavior;
  holdGround: HoldGroundBehavior;
  hurtByTarget: HurtByTargetBehavior;
  inspectBookshelf: InspectBookshelfBehavior;
  investigateSuspiciousLocation: InvestigateSuspiciousLocationBehavior;
  jumpAroundTarget: JumpAroundTargetBehavior;
  jumpToBlock: JumpToBlockBehavior;
  knockbackRoar: KnockbackRoarBehavior;
  layDown: LayDownBehavior;
  layEgg: LayEggBehavior;
  leapAtTarget: LeapAtTargetBehavior;
  lookAtEntity: LookAtEntityBehavior;
  lookAtPlayer: LookAtPlayerBehavior;
  lookAtTarget: LookAtTargetBehavior;
  lookAtTradingPlayer: LookAtTradingPlayerBehavior;
  makeLove: MakeLoveBehavior;
  meleeAttack: MeleeAttackBehavior;
  meleeBoxAttack: MeleeBoxAttackBehavior;
  mingle: MingleBehavior;
  mountPathing: MountPathingBehavior;
  moveAroundTarget: MoveAroundTargetBehavior;
  moveIndoors: MoveIndoorsBehavior;
  moveOutdoors: MoveOutdoorsBehavior;
  moveThroughVillage: MoveThroughVillageBehavior;
  moveToBlock: MoveToBlockBehavior;
  moveToLand: MoveToLandBehavior;
  moveToLava: MoveToLavaBehavior;
  moveToLiquid: MoveToLiquidBehavior;
  moveToPoi: MoveToPoiBehavior;
  moveToRandomBlock: MoveToRandomBlockBehavior;
  moveToVillage: MoveToVillageBehavior;
  moveToWater: MoveToWaterBehavior;
  moveTowardsDwellingRestriction: MoveTowardsDwellingRestrictionBehavior;
  moveTowardsHomeRestriction: MoveTowardsHomeRestrictionBehavior;
  moveTowardsRestriction: MoveTowardsRestrictionBehavior;
  moveTowardsTarget: MoveTowardsTargetBehavior;
  nap: NapBehavior;
  nearestAttackableTarget: NearestAttackableTargetBehavior;
  nearestPrioritizedAttackableTarget: NearestPrioritizedAttackableTargetBehavior;
  ocelotAttack: OcelotAttackBehavior;
  ocelotSitOnBlock: OcelotSitOnBlockBehavior;
  offerFlower: OfferFlowerBehavior;
  openDoor: OpenDoorBehavior;
  ownerHurtByTarget: OwnerHurtByTargetBehavior;
  ownerHurtTarget: OwnerHurtTargetBehavior;
  panic: PanicBehavior;
  petSleepWithOwner: PetSleepWithOwnerBehavior;
  pickupItems: PickupItemsBehavior;
  placeBlock: PlaceBlockBehavior;
  play: PlayBehavior;
  playDead: PlayDeadBehavior;
  playerRideTamed: PlayerRideTamedBehavior;
  raidGarden: RaidGardenBehavior;
  ramAttack: RamAttackBehavior;
  randomBreach: RandomBreachBehavior;
  randomFly: RandomFlyBehavior;
  randomHover: RandomHoverBehavior;
  randomLookAroundAndSit: RandomLookAroundAndSitBehavior;
  randomLookAround: RandomLookAroundBehavior;
  randomSearchAndDig: RandomSearchAndDigBehavior;
  randomSitting: RandomSittingBehavior;
  randomStroll: RandomStrollBehavior;
  randomSwim: RandomSwimBehavior;
  rangedAttack: RangedAttackBehavior;
  receiveLove: ReceiveLoveBehavior;
  restrictOpenDoor: RestrictOpenDoorBehavior;
  restrictSun: RestrictSunBehavior;
  riseToLiquidLevel: RiseToLiquidLevelBehavior;
  roar: RoarBehavior;
  roll: RollBehavior;
  runAroundLikeCrazy: RunAroundLikeCrazyBehavior;
  scared: ScaredBehavior;
  sendEvent: SendEventBehavior;
  shareItems: ShareItemsBehavior;
  silverfishMergeWithStone: SilverfishMergeWithStoneBehavior;
  silverfishWakeUpFriends: SilverfishWakeUpFriendsBehavior;
  skeletonHorseTrap: SkeletonHorseTrapBehavior;
  sleep: SleepBehavior;
  slimeAttack: SlimeAttackBehavior;
  slimeFloat: SlimeFloatBehavior;
  slimeKeepOnJumping: SlimeKeepOnJumpingBehavior;
  slimeRandomDirection: SlimeRandomDirectionBehavior;
  snacking: SnackingBehavior;
  sneeze: SneezeBehavior;
  sniff: SniffBehavior;
  sonicBoom: SonicBoomBehavior;
  squidDive: SquidDiveBehavior;
  squidFlee: SquidFleeBehavior;
  squidIdle: SquidIdleBehavior;
  squidMoveAwayFromGround: SquidMoveAwayFromGroundBehavior;
  squidOutOfWater: SquidOutOfWaterBehavior;
  stalkAndPounceOnTarget: StalkAndPounceOnTargetBehavior;
  stayNearNoteBlock: StayNearNoteBlockBehavior;
  stayWhileSitting: StayWhileSittingBehavior;
  stompAttack: StompAttackBehavior;
  stompTurtleEgg: StompTurtleEggBehavior;
  strollTowardsVillage: StrollTowardsVillageBehavior;
  summonEntity: SummonEntityBehavior;
  swell: SwellBehavior;
  swimIdle: SwimIdleBehavior;
  swimUpForBreath: SwimUpForBreathBehavior;
  swimWander: SwimWanderBehavior;
  swimWithEntity: SwimWithEntityBehavior;
  swoopAttack: SwoopAttackBehavior;
  takeBlock: TakeBlockBehavior;
  takeFlower: TakeFlowerBehavior;
  targetWhenPushed: TargetWhenPushedBehavior;
  teleportToOwner: TeleportToOwnerBehavior;
  tempt: TemptBehavior;
  timerFlag1: TimerFlag1Behavior;
  timerFlag2: TimerFlag2Behavior;
  timerFlag3: TimerFlag3Behavior;
  tradeInterest: TradeInterestBehavior;
  tradeWithPlayer: TradeWithPlayerBehavior;
  transportItems: TransportItemsBehavior;
  useKineticWeapon: UseKineticWeaponBehavior;
  vexCopyOwnerTarget: VexCopyOwnerTargetBehavior;
  vexRandomMove: VexRandomMoveBehavior;
  witherRandomAttackPosGoal: WitherRandomAttackPosGoalBehavior;
  witherTargetHighestDamage: WitherTargetHighestDamageBehavior;
  work: WorkBehavior;
  workComposter: WorkComposterBehavior;
}

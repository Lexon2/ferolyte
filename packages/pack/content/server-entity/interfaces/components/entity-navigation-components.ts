import {
  BlockClimberComponent,
  BuoyantComponent,
  CanClimbComponent,
  CanFlyComponent,
  CanJoinRaidComponent,
  CanPowerJumpComponent,
  FloatsInLiquidComponent,
  FlyingSpeedComponent,
  JumpDynamicComponent,
  JumpStaticComponent,
  MovementAmphibiousComponent,
  MovementBasicComponent,
  MovementFlyComponent,
  MovementGenericComponent,
  MovementGlideComponent,
  MovementHoverComponent,
  MovementJumpComponent,
  MovementSkipComponent,
  MovementSwayComponent,
  NavigationClimbComponent,
  NavigationFloatComponent,
  NavigationFlyComponent,
  NavigationGenericComponent,
  NavigationHoverComponent,
  NavigationSwimComponent,
  NavigationWalkComponent,
  RailMovementComponent,
  WalkAnimationSpeedComponent,
  WaterMovementComponent,
  BodyRotationAlwaysFollowsHeadComponent,
} from './navigation-movement';

export interface EntityNavigationComponents {
  blockClimber?: BlockClimberComponent;
  buoyant?: BuoyantComponent;
  canClimb?: CanClimbComponent;
  canFly?: CanFlyComponent;
  canJoinRaid?: CanJoinRaidComponent;
  canPowerJump?: CanPowerJumpComponent;
  floatsInLiquid?: FloatsInLiquidComponent;
  flyingSpeed?: FlyingSpeedComponent;
  jumpDynamic?: JumpDynamicComponent;
  jumpStatic?: JumpStaticComponent;
  movementAmphibious?: MovementAmphibiousComponent;
  movementBasic?: MovementBasicComponent;
  movementFly?: MovementFlyComponent;
  movementGeneric?: MovementGenericComponent;
  movementGlide?: MovementGlideComponent;
  movementHover?: MovementHoverComponent;
  movementJump?: MovementJumpComponent;
  movementSkip?: MovementSkipComponent;
  movementSway?: MovementSwayComponent;
  navigationClimb?: NavigationClimbComponent;
  navigationFloat?: NavigationFloatComponent;
  navigationFly?: NavigationFlyComponent;
  navigationGeneric?: NavigationGenericComponent;
  navigationHover?: NavigationHoverComponent;
  navigationSwim?: NavigationSwimComponent;
  navigationWalk?: NavigationWalkComponent;
  railMovement?: RailMovementComponent;
  walkAnimationSpeed?: WalkAnimationSpeedComponent;
  waterMovement?: WaterMovementComponent;
  bodyRotationAlwaysFollowsHead?: BodyRotationAlwaysFollowsHeadComponent;
}

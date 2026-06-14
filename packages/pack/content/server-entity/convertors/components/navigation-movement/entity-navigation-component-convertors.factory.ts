import { convertBlockClimberComponent } from './block-climber-component.convertor';
import { convertBodyRotationAlwaysFollowsHeadComponent } from './body-rotation-always-follows-head-component.convertor';
import { convertBuoyantComponent } from './buoyant-component.convertor';
import { convertCanClimbComponent } from './can-climb-component.convertor';
import { convertCanFlyComponent } from './can-fly-component.convertor';
import { convertCanJoinRaidComponent } from './can-join-raid-component.convertor';
import { convertCanPowerJumpComponent } from './can-power-jump-component.convertor';
import { convertFloatsInLiquidComponent } from './floats-in-liquid-component.convertor';
import { convertFlyingSpeedComponent } from './flying-speed-component.convertor';
import { convertJumpDynamicComponent } from './jump-dynamic-component.convertor';
import { convertJumpStaticComponent } from './jump-static-component.convertor';
import { convertMovementAmphibiousComponent } from './movement-amphibious-component';
import { convertMovementBasicComponent } from './movement-basic-component';
import { convertMovementFlyComponent } from './movement-fly-component';
import { convertMovementGenericComponent } from './movement-generic-component';
import { convertMovementGlideComponent } from './movement-glide-component';
import { convertMovementHoverComponent } from './movement-hover-component';
import { convertMovementJumpComponent } from './movement-jump-component';
import { convertMovementSkipComponent } from './movement-skip-component';
import { convertMovementSwayComponent } from './movement-sway-component';
import { convertNavigationClimbComponent } from './navigation-climb-component';
import { convertNavigationFloatComponent } from './navigation-float-component';
import { convertNavigationFlyComponent } from './navigation-fly-component';
import { convertNavigationGenericComponent } from './navigation-generic-component';
import { convertNavigationHoverComponent } from './navigation-hover-component';
import { convertNavigationSwimComponent } from './navigation-swim-component';
import { convertNavigationWalkComponent } from './navigation-walk-component';
import { convertRailMovementComponent } from './rail-movement-component.convertor';
import { convertWalkAnimationSpeedComponent } from './walk-animation-speed-component.convertor';
import { convertWaterMovementComponent } from './water-movement-component.convertor';

export const entityNavigationComponentConvertorsFactory = {
  blockClimber: convertBlockClimberComponent,
  buoyant: convertBuoyantComponent,
  canClimb: convertCanClimbComponent,
  canFly: convertCanFlyComponent,
  canJoinRaid: convertCanJoinRaidComponent,
  canPowerJump: convertCanPowerJumpComponent,
  floatsInLiquid: convertFloatsInLiquidComponent,
  flyingSpeed: convertFlyingSpeedComponent,
  jumpDynamic: convertJumpDynamicComponent,
  jumpStatic: convertJumpStaticComponent,
  movementAmphibious: convertMovementAmphibiousComponent,
  movementBasic: convertMovementBasicComponent,
  movementFly: convertMovementFlyComponent,
  movementGeneric: convertMovementGenericComponent,
  movementGlide: convertMovementGlideComponent,
  movementHover: convertMovementHoverComponent,
  movementJump: convertMovementJumpComponent,
  movementSkip: convertMovementSkipComponent,
  movementSway: convertMovementSwayComponent,
  navigationClimb: convertNavigationClimbComponent,
  navigationFloat: convertNavigationFloatComponent,
  navigationFly: convertNavigationFlyComponent,
  navigationGeneric: convertNavigationGenericComponent,
  navigationHover: convertNavigationHoverComponent,
  navigationSwim: convertNavigationSwimComponent,
  navigationWalk: convertNavigationWalkComponent,
  railMovement: convertRailMovementComponent,
  walkAnimationSpeed: convertWalkAnimationSpeedComponent,
  waterMovement: convertWaterMovementComponent,
  bodyRotationAlwaysFollowsHead: convertBodyRotationAlwaysFollowsHeadComponent,
};

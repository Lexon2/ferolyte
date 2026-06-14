import {
  AirDragModifierComponent,
  BodyRotationBlockedComponent,
  BouncinessComponent,
  CustomHitTestComponent,
  CollisionBoxComponent,
  FrictionModifierComponent,
  PhysicsComponent,
  PushThroughComponent,
  PushableByBlockComponent,
  PushableByEntityComponent,
  RotationAxisAlignedComponent,
  ScaleByAgeComponent,
  ScaleComponent,
  UsesLegacyFrictionComponent,
  UsesUniformAirDragComponent,
} from './physical';

export interface EntityPhysicalComponents {
  airDragModifier?: AirDragModifierComponent;
  bodyRotationBlocked?: BodyRotationBlockedComponent;
  bounciness?: BouncinessComponent;
  customHitTest?: CustomHitTestComponent;
  collisionBox?: CollisionBoxComponent;
  frictionModifier?: FrictionModifierComponent;
  physics?: PhysicsComponent;
  pushThrough?: PushThroughComponent;
  pushableByBlock?: PushableByBlockComponent;
  pushableByEntity?: PushableByEntityComponent;
  rotationAxisAligned?: RotationAxisAlignedComponent;
  scaleByAge?: ScaleByAgeComponent;
  scale?: ScaleComponent;
  usesLegacyFriction?: UsesLegacyFrictionComponent;
  usesUniformAirDrag?: UsesUniformAirDragComponent;
}

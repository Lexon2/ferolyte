import { convertAirDragModifierComponent } from './air-drag-modifier-component.convertor';
import { convertBodyRotationBlockedComponent } from './body-rotation-blocked-component.convertor';
import { convertBouncinessComponent } from './bounciness-component.convertor';
import { convertCollisionBoxComponent } from './collision-box-component.convertor';
import { convertCustomHitTestComponent } from './custom-hit-test-component.convertor';
import { convertFrictionModifierComponent } from './friction-modifier-component.convertor';
import { convertPhysicsComponent } from './physics-component.converter';
import { convertPushThroughComponent } from './push-through-component.convertor';
import { convertPushableByBlockComponent } from './pushable-by-block-component.convertor';
import { convertPushableByEntityComponent } from './pushable-by-entity-component.convertor';
import { convertRotationAxisAlignedComponent } from './rotation-axis-aligned-component.convertor';
import { convertScaleByAgeComponent } from './scale-by-age-component.convertor';
import { convertScaleComponent } from './scale-component.convertor';
import { convertUsesLegacyFrictionComponent } from './uses-legacy-friction-component.convertor';
import { convertUsesUniformAirDragComponent } from './uses-uniform-air-drag-component.convertor';

export const entityPhysicalComponentConvertorsFactory = {
  airDragModifier: convertAirDragModifierComponent,
  bodyRotationBlocked: convertBodyRotationBlockedComponent,
  bounciness: convertBouncinessComponent,
  customHitTest: convertCustomHitTestComponent,
  collisionBox: convertCollisionBoxComponent,
  frictionModifier: convertFrictionModifierComponent,
  physics: convertPhysicsComponent,
  pushThrough: convertPushThroughComponent,
  pushableByBlock: convertPushableByBlockComponent,
  pushableByEntity: convertPushableByEntityComponent,
  rotationAxisAligned: convertRotationAxisAlignedComponent,
  scaleByAge: convertScaleByAgeComponent,
  scale: convertScaleComponent,
  usesLegacyFriction: convertUsesLegacyFrictionComponent,
  usesUniformAirDrag: convertUsesUniformAirDragComponent,
};

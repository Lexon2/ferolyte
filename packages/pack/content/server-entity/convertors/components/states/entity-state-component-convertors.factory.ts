import { convertIsBabyComponent } from './is-baby-component';
import { convertIsChargedComponent } from './is-charged-component';
import { convertIsChestedComponent } from './is-chested-component';
import { convertIsCollidableComponent } from './is-collidable-component';
import { convertIsDyeableComponent } from './is-dyeable-component';
import { convertIsHiddenWhenInvisibleComponent } from './is-hidden-when-invisible-component';
import { convertIsIgnitedComponent } from './is-ignited-component';
import { convertIsIllagerCaptainComponent } from './is-illager-captain-component';
import { convertIsPregnantComponent } from './is-pregnant-component';
import { convertIsSaddledComponent } from './is-saddled-component';
import { convertIsShakingComponent } from './is-shaking-component';
import { convertIsShearedComponent } from './is-sheared-component';
import { convertIsStackableComponent } from './is-stackable-component';
import { convertIsStunnedComponent } from './is-stunned-component';
import { convertIsTamedComponent } from './is-tamed-component';

export const entityStateComponentConvertorsFactory = {
  isBaby: convertIsBabyComponent,
  isCharged: convertIsChargedComponent,
  isChested: convertIsChestedComponent,
  isCollidable: convertIsCollidableComponent,
  isDyeable: convertIsDyeableComponent,
  isHiddenWhenInvisible: convertIsHiddenWhenInvisibleComponent,
  isIgnited: convertIsIgnitedComponent,
  isIllagerCaptain: convertIsIllagerCaptainComponent,
  isPregnant: convertIsPregnantComponent,
  isSaddled: convertIsSaddledComponent,
  isShaking: convertIsShakingComponent,
  isSheared: convertIsShearedComponent,
  isStackable: convertIsStackableComponent,
  isStunned: convertIsStunnedComponent,
  isTamed: convertIsTamedComponent
};

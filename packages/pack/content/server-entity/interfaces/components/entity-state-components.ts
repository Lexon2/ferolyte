import {
  IsBabyComponent,
  IsChargedComponent,
  IsChestedComponent,
  IsCollidableComponent,
  IsDyeableComponent,
  IsHiddenWhenInvisibleComponent,
  IsIgnitedComponent,
  IsIllagerCaptainComponent,
  IsPregnantComponent,
  IsSaddledComponent,
  IsShakingComponent,
  IsShearedComponent,
  IsStackableComponent,
  IsStunnedComponent,
  IsTamedComponent,
} from './states';

export interface EntityStateComponents {
  isBaby?: IsBabyComponent;
  isCharged?: IsChargedComponent;
  isChested?: IsChestedComponent;
  isCollidable?: IsCollidableComponent;
  isDyeable?: IsDyeableComponent;
  isHiddenWhenInvisible?: IsHiddenWhenInvisibleComponent;
  isIgnited?: IsIgnitedComponent;
  isIllagerCaptain?: IsIllagerCaptainComponent;
  isPregnant?: IsPregnantComponent;
  isSaddled?: IsSaddledComponent;
  isShaking?: IsShakingComponent;
  isSheared?: IsShearedComponent;
  isStackable?: IsStackableComponent;
  isStunned?: IsStunnedComponent;
  isTamed?: IsTamedComponent;
}

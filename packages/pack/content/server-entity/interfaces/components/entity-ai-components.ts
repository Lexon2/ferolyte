import {
  AngerLevelComponent,
  AngryComponent,
  BossComponent,
  BreedableComponent,
  BribeableComponent,
  CelebrateHuntComponent,
  DwellerComponent,
  FlockingComponent,
  GroupSizeComponent,
  ManagedWanderingTraderComponent,
  MobEffectComponent,
  MobEffectImmunityComponent,
  NpcComponent,
  OffspringComponent,
  OutOfControlComponent,
  PersistentComponent,
  TameableComponent,
  TamemountComponent,
  TrustComponent,
  TrustingComponent
} from './ai';

export interface EntityAIComponents {
  angerLevel?: AngerLevelComponent;
  angry?: AngryComponent;
  boss?: BossComponent;
  breedable?: BreedableComponent;
  bribeable?: BribeableComponent;
  celebrateHunt?: CelebrateHuntComponent;
  dweller?: DwellerComponent;
  flocking?: FlockingComponent;
  groupSize?: GroupSizeComponent;
  managedWanderingTrader?: ManagedWanderingTraderComponent;
  mobEffect?: MobEffectComponent;
  mobEffectImmunity?: MobEffectImmunityComponent;
  npc?: NpcComponent;
  offspring?: OffspringComponent;
  outOfControl?: OutOfControlComponent;
  persistent?: PersistentComponent;
  tameable?: TameableComponent;
  tamemount?: TamemountComponent;
  trust?: TrustComponent;
  trusting?: TrustingComponent;
}

import { convertAngerLevelComponent } from './anger-level-component.convertor';
import { convertAngryComponent } from './angry-component.convertor';
import { convertBossComponent } from './boss-component.convertor';
import { convertBreedableComponent } from './breedable-component.convertor';
import { convertBribeableComponent } from './bribeable-component.convertor';
import { convertCelebrateHuntComponent } from './celebrate-hunt-component.convertor';
import { convertDwellerComponent } from './dweller-component.convertor';
import { convertFlockingComponent } from './flocking-component.convertor';
import { convertGroupSizeComponent } from './group-size-component.convertor';
import { convertManagedWanderingTraderComponent } from './managed-wandering-trader-component.convertor';
import { convertMobEffectComponent } from './mob-effect-component.convertor';
import { convertMobEffectImmunityComponent } from './mob-effect-immunity-component.convertor';
import { convertNpcComponent } from './npc-component.convertor';
import { convertOffspringComponent } from './offspring-component.convertor';
import { convertOutOfControlComponent } from './out-of-control-component.converter';
import { convertPersistentComponent } from './persistent-component.convertor';
import { convertTameableComponent } from './tameable-component.convert';
import { convertTamemountComponent } from './tamemount-component.convertor';
import { convertTrustComponent } from './trust-component.convertor';
import { convertTrustingComponent } from './trusting-component.convertor';

export const entityAiComponentConvertorsFactory = {
  angerLevel: convertAngerLevelComponent,
  angry: convertAngryComponent,
  boss: convertBossComponent,
  breedable: convertBreedableComponent,
  bribeable: convertBribeableComponent,
  celebrateHunt: convertCelebrateHuntComponent,
  dweller: convertDwellerComponent,
  flocking: convertFlockingComponent,
  groupSize: convertGroupSizeComponent,
  managedWanderingTrader: convertManagedWanderingTraderComponent,
  mobEffect: convertMobEffectComponent,
  mobEffectImmunity: convertMobEffectImmunityComponent,
  npc: convertNpcComponent,
  offspring: convertOffspringComponent,
  outOfControl: convertOutOfControlComponent,
  persistent: convertPersistentComponent,
  tameable: convertTameableComponent,
  tamemount: convertTamemountComponent,
  trust: convertTrustComponent,
  trusting: convertTrustingComponent
};

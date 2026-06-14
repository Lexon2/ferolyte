import { convertAbsorptionComponent } from './absorption-component';
import { convertAttackDamageComponent } from './attack-damage-component';
import { convertHealthComponent } from './health-component';
import { convertKnockbackResistanceComponent } from './knockback-resistance-component';
import { convertLavaMovementComponent } from './lava-movement-component';
import { convertLuckComponent } from './luck-component';
import { convertMovementComponent } from './movement-component';
import { convertUnderwaterMovementComponent } from './underwater-movement-component';

export const entityAttributeComponentConvertorsFactory = {
  absorption: convertAbsorptionComponent,
  attackDamage: convertAttackDamageComponent,
  health: convertHealthComponent,
  knockbackResistance: convertKnockbackResistanceComponent,
  lavaMovement: convertLavaMovementComponent,
  luck: convertLuckComponent,
  movement: convertMovementComponent,
  underwaterMovement: convertUnderwaterMovementComponent
};

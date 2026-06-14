import {
  AbsorptionComponent,
  AttackDamageComponent,
  HealthComponent,
  KnockbackResistanceComponent,
  LavaMovementComponent,
  LuckComponent,
  MovementComponent,
  UnderwaterMovementComponent
} from './attribute';

export interface EntityAttributeComponents {
  absorption?: AbsorptionComponent;
  attackDamage?: AttackDamageComponent;
  health?: HealthComponent;
  knockbackResistance?: KnockbackResistanceComponent;
  lavaMovement?: LavaMovementComponent;
  luck?: LuckComponent;
  movement?: MovementComponent;
  underwaterMovement?: UnderwaterMovementComponent;
}
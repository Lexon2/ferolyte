import { convertAdmireItemComponent } from './admire-item-component.convertor';
import { convertApplyKnockbackRulesComponent } from './apply-knockback-rules-component.convertor';
import { convertAreaAttackComponent } from './area-attack-component.convertor';
import { convertAttackComponent } from './attack-component.convertor';
import { convertAttackCooldownComponent } from './attack-cooldown-component.convertor';
import { convertCannotBeAttackedComponent } from './cannot-be-attacked-component.convertor';
import { convertCombatRegenerationComponent } from './combat-regeneration-component.convertor';
import { convertDamageOverTimeComponent } from './damage-over-time-component.convertor';
import { convertFollowRangeComponent } from './follow-range-component.convertor';
import { convertIgnoreCannotBeAttackedComponent } from './ignore-cannot-be-attacked-component.convertor';
import { convertProjectileComponent } from './projectile-component.convertor';
import { convertReflectProjectilesComponent } from './reflect-projectiles-component.convertor';
import { convertShooterComponent } from './shooter-component.convertor';

export const entityCombatComponentConvertorsFactory = {
  admireItem: convertAdmireItemComponent,
  applyKnockbackRules: convertApplyKnockbackRulesComponent,
  areaAttack: convertAreaAttackComponent,
  attack: convertAttackComponent,
  attackCooldown: convertAttackCooldownComponent,
  cannotBeAttacked: convertCannotBeAttackedComponent,
  combatRegeneration: convertCombatRegenerationComponent,
  damageOverTime: convertDamageOverTimeComponent,
  ignoreCannotBeAttacked: convertIgnoreCannotBeAttackedComponent,
  projectile: convertProjectileComponent,
  reflectProjectiles: convertReflectProjectilesComponent,
  shooter: convertShooterComponent,
  followRange: convertFollowRangeComponent,
};

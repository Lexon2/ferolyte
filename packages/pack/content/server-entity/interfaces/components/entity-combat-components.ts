import {
  AdmireItemComponent,
  ApplyKnockbackRulesComponent,
  AreaAttackComponent,
  AttackComponent,
  AttackCooldownComponent,
  CannotBeAttackedComponent,
  CombatRegenerationComponent,
  DamageOverTimeComponent,
  IgnoreCannotBeAttackedComponent,
  ProjectileComponent,
  ReflectProjectilesComponent,
  ShooterComponent,
  FollowRangeComponent,
} from './combat';

export interface EntityCombatComponents {
  admireItem?: AdmireItemComponent;
  applyKnockbackRules?: ApplyKnockbackRulesComponent;
  areaAttack?: AreaAttackComponent;
  attack?: AttackComponent;
  attackCooldown?: AttackCooldownComponent;
  cannotBeAttacked?: CannotBeAttackedComponent;
  combatRegeneration?: CombatRegenerationComponent;
  damageOverTime?: DamageOverTimeComponent;
  ignoreCannotBeAttacked?: IgnoreCannotBeAttackedComponent;
  projectile?: ProjectileComponent;
  reflectProjectiles?: ReflectProjectilesComponent;
  shooter?: ShooterComponent;
  followRange?: FollowRangeComponent;
}

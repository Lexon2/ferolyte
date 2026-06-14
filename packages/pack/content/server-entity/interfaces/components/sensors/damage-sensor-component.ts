import { DamageSourceType } from '../../../constants/damage-source-types';
import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the damage_sensor component
 * Defines what events to call when this entity is damaged by specific entities or items
 */
export interface DamageSensorComponent {
  /**
   * List of triggers that fire when the environment conditions match the given filter criteria
   */
  triggers?: Array<DamageTrigger>;
}

/**
 * Interface for a damage trigger
 */
export interface DamageTrigger {
  /**
   * Type of damage that triggers the events
   * @default "none"
   */
  cause?: DamageSourceType;
  /**
   * A modifier that adds to/removes from the base damage from the damage cause
   * @default 0.0
   */
  damageModifier?: number;
  /**
   * A multiplier that modifies the base damage from the damage cause
   * @default 1
   */
  damageMultiplier?: number;
  /**
   * Defines how received damage affects the entity:
   * - 'yes', received damage is applied to the entity
   * - 'no', received damage is not applied to the entity
   * - 'no_but_side_effects_apply', received damage is not applied to the entity, but the side effects of the attack are
   * @default "yes"
   */
  dealsDamage?: 'yes' | 'no' | 'no_but_side_effects_apply';
  /**
   * Specifies filters for entity definitions and events
   */
  onDamage?: EntityEventTrigger;
  /**
   * Defines what sound to play, if any, when the on_damage filters are met
   */
  onDamageSoundEvent?: string;
}

import { EffectType } from '../../../constants/effect-types';
import { EntityFilters } from '../../filters';

/**
 * Interface for the healable component
 * Defines the interactions with this entity for healing it.
 */
export interface HealableComponent {
  /**
   * The filter group that defines the conditions for using this item to heal the entity
   */
  filters?: EntityFilters;

  /**
   * Determines if item can be used regardless of entity being at full health
   * @default false
   */
  forceUse?: boolean;

  /**
   * The array of items that can be used to heal this entity
   */
  items?: Array<{
    /**
     * The filter group that defines the conditions for using this item to heal the entity
     */
    filters?: EntityFilters;

    /**
     * The amount of health this entity gains when fed this item
     * @default 1
     */
    healAmount?: number;

    /**
     * Item that can be used to heal this entity
     */
    item?: string;

    /**
     * Effects to apply when this item is used to heal the entity
     */
    effects?: HealableEffect | HealableEffect[];
  }>;
}

export interface HealableEffect {
  /**
   * Effect name
   */
  name: EffectType;

  /**
   * The duration of the effect
   * @default 1
   */
  duration?: number | 'infinite';

  /**
   * The amplifier of the effect
   * @default 0
   */
  amplifier?: number;
}

/**
 * Interface for the spell_effects component
 * Defines what mob effects to add and remove to the entity when adding this component
 */
export interface SpellEffectsComponent {
  /**
   * List of effects to add to this entity after adding this component
   */
  addEffects?: Array<{
    /**
     * The level of the effect, same as used in the /effect command (0 for level I, 1 for level II, etc)
     * @default 0
     */
    amplifier?: number;

    /**
     * Boolean value that should cause the particles emitted by the entity to be partially transparent
     * @default false
     */
    ambient?: boolean;

    /**
     * The amount of time in seconds the effect should last
     */
    duration?: number | 'infinite';

    /**
     * When set to true, applying this effect displays an animated graphic on-screen similar to the totem of undying effect
     * @default false
     */
    displayOnScreenAnimation?: boolean;

    /**
     * The string identifier of the status effect to add
     */
    effect: string;

    /**
     * When set to true, the effect will be visible to the player
     * @default true
     */
    visible?: boolean;
  }>;

  /**
   * List of identifiers of effects to be removed from this entity after adding this component
   */
  removeEffects?: string | string[];
}

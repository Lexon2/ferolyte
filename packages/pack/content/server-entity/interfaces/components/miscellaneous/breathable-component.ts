/**
 * Interface for the breathable component
 * Defines what blocks this entity can breathe in and gives them the ability to suffocate.
 */
export interface BreathableComponent {
  /**
   * Time in seconds the entity can hold its breath
   * @default 15
   */
  totalSupply?: number;

  /**
   * Time in seconds between suffocation damage
   * @default -20
   */
  suffocateTime?: number;

  /**
   * Time in seconds to recover breath to maximum
   * @default 0
   */
  inhaleTime?: number;

  /**
   * If true, this entity can breathe in air
   * @default true
   */
  breathesAir?: boolean;

  /**
   * If true, this entity can breathe in water
   * @default false
   */
  breathesWater?: boolean;

  /**
   * If true, this entity can breathe in lava
   * @default false
   */
  breathesLava?: boolean;

  /**
   * If true, this entity can breathe in solid blocks
   * @default false
   */
  breathesSolids?: boolean;

  /**
   * If true, this entity will have visible bubbles while in water
   * @default true
   */
  generatesBubbles?: boolean;

  /**
   * List of blocks this entity can breathe in, in addition to the above
   */
  breatheBlocks?: string[];

  /**
   * List of blocks this entity can't breathe in, in addition to the above
   */
  nonBreatheBlocks?: string[];
}

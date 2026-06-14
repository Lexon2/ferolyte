/**
 * Interface for the flocking component
 * Allows entities to flock in groups in water or not
 */
export interface FlockingComponent {
  /**
   * The amount of blocks away the entity will look at to push away from
   * @default 0
   */
  blockDistance?: number;

  /**
   * The weight of the push back away from blocks
   * @default 0
   */
  blockWeight?: number;

  /**
   * The amount of push back given to a flocker that breaches out of the water
   * @default 0
   */
  breachInfluence?: number;

  /**
   * The threshold in which to start applying cohesion
   * @default 1
   */
  cohesionThreshold?: number;

  /**
   * The weight applied for the cohesion steering of the flock
   * @default 1
   */
  cohesionWeight?: number;

  /**
   * The weight on which to apply on the goal output
   * @default 0
   */
  goalWeight?: number;

  /**
   * Determines the high bound amount of entities that can be allowed in the flock
   * @default 0
   */
  highFlockLimit?: number;

  /**
   * Tells the Flocking Component if the entity exists in water
   * @default false
   */
  inWater?: boolean;

  /**
   * The area around the entity that allows others to be added to the flock
   * @default 0
   */
  influenceRadius?: number;

  /**
   * The distance in which the flocker will stop applying cohesion
   * @default 0
   */
  innnerCohesionThreshold?: number;

  /**
   * The percentage chance between 0-1 that a fish will spawn and not want to join flocks
   * @default 0
   */
  lonerChance?: number;

  /**
   * Determines the low bound amount of entities that can be allowed in the flock
   * @default 0
   */
  lowFlockLimit?: number;

  /**
   * Tells the flockers that they can only match similar entities that also match the variant, mark variants, and color data of the other potential flockers
   * @default false
   */
  matchVariants?: boolean;

  /**
   * The Maximum height allowable in the air or water
   * @default 0
   */
  maxHeight?: number;

  /**
   * The Minimum height allowable in the air or water
   * @default 0
   */
  minHeight?: number;

  /**
   * The distance that is determined to be to close to another flocking and to start applying separation
   * @default 2
   */
  separationThreshold?: number;

  /**
   * The weight applied to the separation of the flock
   * @default 1
   */
  separationWeight?: number;

  /**
   * Tells the flockers that they will follow flocks based on the center of mass
   * @default false
   */
  useCenterOfMass?: boolean;
}

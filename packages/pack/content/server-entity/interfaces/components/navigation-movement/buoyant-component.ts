/**
 * Interface for the buoyant component
 * Enables an entity to float on the specified liquid blocks.
 */
export interface BuoyantComponent {
  /**
   * Base buoyancy used to calculate how much will a mob float
   * @default 0
   */
  baseBuoyancy?: number;
  /**
   * Applies gravity each tick. Causes more of a wave simulation, but will cause more gravity to be applied outside liquids
   * @default true
   */
  applyGravity?: boolean;
  /**
   * Base buoyancy used to calculate how much will a mob float
   * @default 1
   */
  buoyancy?: number;
  /**
   * Probability for a big wave hitting the entity. Only used if `simulateWaves` is true
   * @default 0.03
   */
  bigWaveProbability?: number;
  /**
   * Multiplier for the speed to make a big wave. Triggered depending on `bigWaveProbability`
   * @default 1
   */
  bigWaveSpeed?: number;
  /**
   * How much an actor will be dragged down when the Buoyancy Component is removed
   * @default 1
   */
  dragDownOnBuoyancyRemoved?: number;
  /**
   * List of blocks this entity can float on. Must be a liquid block
   */
  liquidBlocks?: string[];
  /**
   * Should the movement simulate waves going through
   * @default true
   */
  simulateWaves?: boolean;
}

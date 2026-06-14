/**
 * Interface for the max turn property used by movement components
 * Defines the maximum turn rate for entity movement
 */
export interface MaxTurn {
  /**
   * The maximum number in degrees the mob can turn per tick.
   * @default 30
   */
  maxTurn?: number;
}

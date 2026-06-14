/**
 * Interface for the custom_hit_test component
 * List of hitboxes for melee and ranged hits against the entity.
 */
export interface CustomHitTestComponent {
  /**
   * Defines a hitbox size and pivot to test against
   */
  hitboxes?: Array<Hitbox>;
}

/**
 * Interface for a hitbox
 */
export interface Hitbox {
  /**
   * Width of the hitbox in blocks. A negative value will be assumed to be 0
   * @default 0
   */
  width: number;
  /**
   * Height of the hitbox in blocks. A negative value will be assumed to be 0
   * @default 0
   */
  height: number;
  /**
   * The offset from the entity's anchor where the hitbox will spawn
     * @default [0, 0, 0]
     */
  pivot: [number, number, number];
}

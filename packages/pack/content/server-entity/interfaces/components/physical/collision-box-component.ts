/**
 * Interface for the collision_box component
 * Sets the width and height of the Entity's collision box.
 */
export interface CollisionBoxComponent {
  /**
   * Width of the collision box in blocks. A negative value will be assumed to be 0
   * @default 1.0
   */
  width?: number;

  /**
   * Height of the collision box in blocks. A negative value will be assumed to be 0
   * @default 1.0
   */
  height?: number;
}

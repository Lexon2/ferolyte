/**
 * Interface for the ground_offset component
 * Sets the offset from the ground that the entity is actually at.
 */
export interface GroundOffsetComponent {
  /**
   * The offset from the ground that the entity is actually at.
   * @default 0.0
   */
  value?: number;
}

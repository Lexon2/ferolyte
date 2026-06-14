/**
 * Interface for the push_through component
 * Sets the distance through which the entity can push through.
 */
export interface PushThroughComponent {
  /**
   * The value of the entity's push-through, in blocks
   * @default 0.0
   */
  value?: number;
}

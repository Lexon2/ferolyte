/**
 * Interface for the bounciness component
 * Controls how an entity bounces when colliding with surfaces.
 */
export interface BouncinessComponent {
  /**
   * Defines the bounce strength. 0 results in no bounce while 1 results in a perfectly elastic collision.
   * @default 0
   */
  value?: number;
}

/**
 * Interface for the balloonable component
 * Allows the entity to have a balloon attached and defines the conditions and events for the entity when is ballooned.
 */
export interface BalloonableComponent {
  /**
   * Distance in blocks where the 'spring' effect lifts the entity
   * @default 2
   */
  softDistance?: number;
  /**
   * Distance in blocks where the balloon breaks
   * @default 10
   */
  maxDistance?: number;
  /**
   * Event to call when the entity is ballooned
   */
  onBalloon?: string;
  /**
   * Event to call when the entity is unballooned
   */
  onUnballoon?: string;
  /**
   * Mass that the entity has when computing balloon pull forces
   * @default 1
   */
  mass?: number;
}

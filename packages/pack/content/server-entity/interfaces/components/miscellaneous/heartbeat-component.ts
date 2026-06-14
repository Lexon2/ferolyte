/**
 * Interface for the heartbeat component
 * Defines the entity's heartbeat state.
 */
export interface HeartbeatComponent {
  /**
   * A Molang expression defining the inter-beat interval in seconds. A value of zero or less means no heartbeat.
   */
  interval: number;

  /**
   * Level sound event to be played as the heartbeat sound.
   */
  soundEvent: string;
}

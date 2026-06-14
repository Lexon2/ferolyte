/**
 * Interface for the ambient_sound_interval component
 * Sets the entity's delay between playing its ambient sound.
 */
export interface AmbientSoundIntervalComponent {
  /**
   * Level sound event to be played as the ambient sound
   * @default "ambient"
   */
  eventName?: string;

  /**
   * List of dynamic level sound events, with conditions for choosing between them
   */
  eventNames?: Array<{
    /**
     * The condition that must be satisfied to select the given ambient sound
     */
    condition?: string;

    /**
     * Level sound event to be played as the ambient sound
     */
    eventName?: string;
  }>;

  /**
   * Maximum time in seconds to randomly add to the ambient sound delay time
   * @default 16.0
   */
  range?: number;

  /**
   * Minimum time in seconds before the entity plays its ambient sound again
   * @default 8.0
   */
  value?: number;
}

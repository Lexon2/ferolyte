/**
 * Interface for the sound_volume component
 * Sets the entity's base volume for sound effects
 */
export interface SoundVolumeComponent {
  /**
   * The value of the volume the entity uses for sound effects
   * @default 1.0
   */
  value?: number;
}

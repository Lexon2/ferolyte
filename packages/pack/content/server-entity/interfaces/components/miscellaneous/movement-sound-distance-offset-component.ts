/**
 * Interface for the movement_sound_distance_offset component
 * Sets the offset used to determine the next step distance for playing a movement sound.
 */
export interface MovementSoundDistanceOffsetComponent {
  /**
   * The higher the number, the less often the movement sound will be played
   * @default 1.0
   */
  value: number;
}

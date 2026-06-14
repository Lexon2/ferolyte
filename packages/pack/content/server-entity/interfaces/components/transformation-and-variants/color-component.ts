/**
 * Interface for the color component
 * Defines the entity's color. Only works on vanilla entities that have predefined color values (sheep, llama, shulker).
 */
export interface ColorComponent {
  /**
   * The Palette Color value of the entity
   * @default 0
   */
  value: number;
}

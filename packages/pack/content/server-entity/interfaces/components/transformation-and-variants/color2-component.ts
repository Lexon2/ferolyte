/**
 * Interface for the color2 component
 * Defines the entity's second texture color. Only works on vanilla entities that have a second predefined color values (tropical fish).
 */
export interface Color2Component {
  /**
   * The second Palette Color value of the entity
   * @default 0
   */
  value: number;
}

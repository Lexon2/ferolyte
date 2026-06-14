/**
 * Interface for the scale_by_age component
 * Defines the entity's size interpolation based on the entity's age.
 */
export interface ScaleByAgeComponent {
  /**
   * Ending scale of the entity when it's fully grown
   * @default 1
   */
  endScale?: number;

  /**
   * Initial scale of the newborn entity
   * @default 1
   */
  startScale?: number;
}

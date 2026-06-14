/**
 * Interface for the scale component
 * Sets the entity's visual size
 */
export interface ScaleComponent {
  /**
   * The value of the scale
   * 1.0 means the entity will appear at the scale they are defined in their model
   * Higher numbers make the entity bigger
   * @default 0.0
   */
  value?: number;
}

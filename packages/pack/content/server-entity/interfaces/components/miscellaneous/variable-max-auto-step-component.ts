/**
 * Interface for the variable_max_auto_step component
 * Entities with this component will have a maximum auto step height that is different depending on whether they are on a block that prevents jumping
 */
export interface VariableMaxAutoStepComponent {
  /**
   * The maximum auto step height when on any other block
   * @default 0.5625
   */
  baseValue?: number;

  /**
   * The maximum auto step height when on any other block and controlled by the player
   * @default 0.5625
   */
  controlledValue?: number;

  /**
   * The maximum auto step height when on a block that prevents jumping
   * @default 0.5625
   */
  jumpPreventedValue?: number;
}

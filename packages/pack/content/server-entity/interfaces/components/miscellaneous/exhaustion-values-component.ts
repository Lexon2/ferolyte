/**
 * Interface for the exhaustion_values component
 * Defines how much exhaustion each player action should take.
 */
export interface ExhaustionValuesComponent {
  /**
   * Amount of exhaustion applied when attacking
   * @default 0.1
   */
  attack?: number;

  /**
   * Amount of exhaustion applied when taking damage
   * @default 0.1
   */
  damage?: number;

  /**
   * Amount of exhaustion applied when healed through food regeneration
   * @default 6
   */
  heal?: number;

  /**
   * Amount of exhaustion applied when jumping
   * @default 0.05
   */
  jump?: number;

  /**
   * Amount of exhaustion applied when mining
   * @default 0.005
   */
  mine?: number;

  /**
   * Amount of exhaustion applied when sprinting
   * @default 0.01
   */
  sprint?: number;

  /**
   * Amount of exhaustion applied when sprint jumping
   * @default 0.2
   */
  sprintJump?: number;

  /**
   * Amount of exhaustion applied when swimming
   * @default 0.01
   */
  swim?: number;

  /**
   * Amount of exhaustion applied when walking
   * @default 0
   */
  walk?: number;
}

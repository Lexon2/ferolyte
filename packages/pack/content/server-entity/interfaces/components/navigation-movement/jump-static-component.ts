/**
 * Interface for the jump.static component
 * Gives the entity the ability to jump.
 */
export interface JumpStaticComponent {
  /**
   * The initial vertical velocity for the jump
   * @default 0.42
   */
  jumpPower?: number;
}

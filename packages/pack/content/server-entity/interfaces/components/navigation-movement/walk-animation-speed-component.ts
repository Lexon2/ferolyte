/**
 * Interface for the walk_animation_speed component
 * Sets the speed multiplier for this entity's walk animation speed
 */
export interface WalkAnimationSpeedComponent {
  /**
   * The higher the number, the faster the animation for walking plays
   * A value of 1.0 means normal speed, while 2.0 means twice as fast
   * @default 1
   */
  value?: number;
}

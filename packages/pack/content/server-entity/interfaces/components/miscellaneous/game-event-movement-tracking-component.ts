
/**
 * Game Event Movement Tracking Component
 * @description Allows an entity to emit `entityMove`, `swim` and `flap` game events, depending on the block the entity is moving through. It is added by default to every mob. Add it again to override its behavior.
 */
export interface GameEventMovementTrackingComponent {
  /**
   * If true, the entity will emit the `flap` game event when it moves through air.
   * @default false
   */
emitFlap?: boolean;

  /**
   * If true, the entity will emit the `entityMove` game event when it moves on ground or through a solid.
   * @default true
   */
  emitMove?: boolean;

  /**
   * If true, the entity will emit the `swim` game event when it moves through a liquid.
   * @default true
   */
  emitSwim?: boolean;
}

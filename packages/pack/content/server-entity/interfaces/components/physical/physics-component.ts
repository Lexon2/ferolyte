/**
 * Interface for the physics component
 * Controls basic entity physics like collision, gravity, etc.
 */
export interface PhysicsComponent {
  /**
   * Whether the entity has gravity
   * @default true
   */
  hasGravity?: boolean;

  /**
   * Whether the entity has collision
   * @default true
   */
  hasCollision?: boolean;

  /**
   * Whether the entity pushes other entities
   * @default true
   */
  pushesOtherEntities?: boolean;

  /**
   * Whether the entity can be pushed by other entities
   * @default true
   */
  pushTowardsClosestSpace?: boolean;
}

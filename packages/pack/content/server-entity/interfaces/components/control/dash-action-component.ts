/**
 * Interface for the dash_action component
 * Ability for a ridable entity to dash.
 */
export interface DashActionComponent {
  /**
   * Whether the entity can dash underwater.
   * @default false
   */
  canDashUnderwater?: boolean;

  /**
   * The dash cooldown in seconds.
   * @default 1
   */
  cooldownTime?: number;

  /**
   * Horizontal momentum of the dash.
   * @default 1
   */
  horizontalMomentum?: number;

  /**
   * Vertical momentum of the dash.
   * @default 1
   */
  verticalMomentum?: number;

  /**
   * Whether momentum is applied in the direction of the entity or passenger.
   * @default "entity"
   */
  direction?: 'entity' | 'passenger';
}

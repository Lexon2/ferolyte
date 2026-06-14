/**
 * Interface for the bribeable component
 * Defines the way an entity can get into the 'bribed' state.
 */
export interface BribeableComponent {
  /**
   * Time in seconds before the Entity can be bribed again
   * @default 2
   */
  bribeCooldown?: number;

  /**
   * The list of items that can be used to bribe the entity
   */
  bribeItems?: string[];
}

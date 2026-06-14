import { StateObject } from '../../../../common/interfaces/state-object';

/**
 * Interface for the is_dyeable component
 * Allows dyes to be used on this entity to change its color
 */
export interface IsDyeableComponent extends StateObject {
  /**
   * The text that will display when interacting with this entity with a dye when playing with Touch-screen controls
   */
  interactText?: string;
}

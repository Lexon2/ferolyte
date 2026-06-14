import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the nameable component
 * Allows this entity to be named (e.g. using a name tag).
 */
export interface NameableComponent {
  /**
   * If true, this entity can be renamed with name tags
   * @default true
   */
  allowNameTagRenaming?: boolean;

  /**
   * If true, the name will always be shown
   * @default false
   */
  alwaysShow?: boolean;

  /**
   * Trigger to run when the entity gets named
   */
  defaultTrigger?: EntityEventTrigger;

  /**
   * Describes the special names for this entity and the events to call when the entity acquires those names
   */
  nameActions?:
    | {
        /**
         * List of special names that will cause the events defined in `onNamed` to fire
         */
        nameFilter?: string;

        /**
         * Event to be called when this entity acquires the name specified in `nameFilter`
         */
        onNamed?: EntityEventTrigger;
      }
    | Array<{
        nameFilter?: string;
        onNamed?: EntityEventTrigger;
      }>;
}

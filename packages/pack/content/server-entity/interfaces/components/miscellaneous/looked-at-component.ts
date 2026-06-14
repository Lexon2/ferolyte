import { EntityFilters } from '../../filters';
import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the looked_at component
 * Defines the behavior when another entity looks at this entity.
 */
export interface LookedAtComponent {
  /**
   * Defines, in degrees, the width of the field of view for entities looking at the owner entity
   * @default 26
   */
  fieldOfView?: number;

  /**
   * Defines the entities that can trigger this component
   */
  filters?: EntityFilters;

  /**
   * Limits the search to only the nearest Player that meets the specified "filters" rather than all nearby entities
   * @default false
   */
  findPlayersOnly?: boolean;

  /**
   * Defines the type of block shape used to check for line of sight obstructions
   * @default "collision"
   */
  lineOfSightObstructionType?: 'outline' | 'collision' | 'collision_for_camera';

  /**
   * A list of locations on the owner entity towards which line of sight checks are performed
   */
  lookAtLocations: Array<{
    /**
     * Location to be looked at
     */
    location: 'head' | 'body' | 'feet';

    /**
     * Vertical offset from the set location
     */
    verticalOffset?: number;
  }>;

  /**
   * The range for the random amount of time during which the entity is `cooling down` and won't get angered or look for a target
   * @default [0.0, 0.0]
   */
  lookedAtCooldown?: [number, number];

  /**
   * The event identifier to run when the entities specified in filters look at this entity
   */
  lookedAtEvent?: EntityEventTrigger;

  /**
   * Defines the event to trigger when no entity is found looking at the owner entity
   */
  notLookedAtEvent?: EntityEventTrigger;

  /**
   * When true, the field of view narrows as the distance between the owner entity and the entity looking at it increases
   * @default false
   */
  scaleFovByDistance?: boolean;

  /**
   * Maximum distance this entity will look for another entity looking at it
   * @default 10
   */
  searchRadius?: number;

  /**
   * Defines the minimum, continuous time the owner entity has to be looked at before being considered as such
   * @default 0
   */
  minLookedAtDuration?: number;

  /**
   * Defines if and how the owner entity will set entities that are looking at it as its combat targets
   * @default "once_and_stop_scanning"
   */
  setTarget?: 'never' | 'once_and_stop_scanning' | 'once_and_keep_scanning';
}

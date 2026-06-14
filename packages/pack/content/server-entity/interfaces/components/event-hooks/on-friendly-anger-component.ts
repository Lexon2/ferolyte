import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the on_friendly_anger component
 * Adds a trigger that will run when a nearby entity of the same type as this entity becomes Angry.
 */
export interface OnFriendlyAngerComponent extends EntityEventTrigger {}

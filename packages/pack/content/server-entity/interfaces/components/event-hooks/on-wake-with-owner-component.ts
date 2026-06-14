import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the on_wake_with_owner component
 * Adds a trigger to call when this pet's owner awakes after sleeping with the pet.
 */
export interface OnWakeWithOwnerComponent extends EntityEventTrigger {}

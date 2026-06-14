import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the on_start_takeoff component
 * Only usable by the Ender Dragon. Adds a trigger to call when this entity starts flying.
 */
export interface OnStartTakeoffComponent extends EntityEventTrigger {}

import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the on_death component
 * Adds a trigger to call on this entity's death. minecraft:on_death can only be used by the `ender_dragon` entity.
 */
export interface OnDeathComponent extends EntityEventTrigger {}

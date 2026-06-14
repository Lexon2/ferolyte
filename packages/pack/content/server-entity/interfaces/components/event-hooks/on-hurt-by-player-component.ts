import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the on_hurt_by_player component
 * Adds a trigger to call when this entity is attacked by the player.
 */
export interface OnHurtByPlayerComponent extends EntityEventTrigger {}

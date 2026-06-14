import { StateObject } from '../../../../common/interfaces/state-object';

/**
 * Interface for the persistent component
 * Makes an entity persist even when chunks are unloaded
 */
export interface PersistentComponent extends StateObject {}

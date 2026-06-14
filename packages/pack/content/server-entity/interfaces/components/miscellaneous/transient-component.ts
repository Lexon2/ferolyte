import { StateObject } from '../../../../common/interfaces/state-object';

/**
 * Interface for the transient component
 * An entity with this component will NEVER persist, and forever disappear when unloaded.
 */
export interface TransientComponent extends StateObject {}

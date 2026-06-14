import { StateObject } from '../../../../common/interfaces/state-object';

/**
 * Interface for the renders_when_invisible component
 * When set, the entity will render even when invisible. Appropriate rendering behavior can then be specified in the corresponding "minecraft:client_entity".
 */
export interface RendersWhenInvisibleComponent extends StateObject {}

import { StateObject } from '../../../../common/interfaces/state-object';

/**
 * Interface for the cannot_be_attacked component
 * When set, blocks entities from attacking the owner entity unless they have the "minecraft:ignore_cannot_be_attacked" component.
 */
export interface CannotBeAttackedComponent extends StateObject {
  // No properties needed as it simply blocks attacks
}

import { StateObject } from '../../../../common/interfaces/state-object';

/**
 * Interface for the dimension_bound component
 * Restricts entities from moving between dimensions when using Minecraft portals, keeping them bound to their current dimension.
 */
export interface DimensionBoundComponent extends StateObject {}

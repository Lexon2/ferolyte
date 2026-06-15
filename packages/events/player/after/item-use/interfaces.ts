import { Player } from '@minecraft/server';

import { Identifier, RequireAtLeastOne } from '@ferolyte/common/types';
import { EventBlockTypeIdsRouteOption } from '@ferolyte/events/common/interfaces';

// Public Types ///

export interface ItemUseEventWithPlayerContext {
  player: Player;
}

export type ItemUseAfterEventRouteOptions = RequireAtLeastOne<{
  itemTypeId: Identifier[];
}>;

export type ItemUseOnAfterEventRouteOptions = RequireAtLeastOne<
  {
    itemTypeId: Identifier[];
  } & EventBlockTypeIdsRouteOption
>;

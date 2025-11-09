import { PlayerBreakBlockAfterEvent, world } from '@minecraft/server';

import { RequireAtLeastOne } from '@artifex/common/types';
import { BasicEventListener } from '@artifex/events/common/basic-event.listener';
import { BasicEventRouter } from '@artifex/events/common/basic-event.router';
import {
  EVENT_ROUTE_GLOBAL_ID,
  EventRoutePrefix,
} from '@artifex/events/common/constants';
import {
  EventBeforeItemTypeIdsRouteOption,
  EventBlockTypeIdsRouteOption,
  EventBrokenBlockTypeIdsRouteOption,
  EventItemTypeIdsRouteOption,
  EventRouteController,
} from '@artifex/events/common/interfaces';
import { EventAction, EventActionData } from '@artifex/events/common/types';
import { ArtifexEventUtils } from '@artifex/events/common/utils';

/// Private Types ///

type Action = EventAction<PlayerBreakBlockAfterEvent>;

/// Private API ///

let router: BasicEventRouter<Action, EventActionData<Action>> | undefined;
let listener: BasicEventListener<PlayerBreakBlockAfterEvent> | undefined;

// Public Types ///

export type PlayerBreakBlockAfterEventRouteOptions = RequireAtLeastOne<
  EventBlockTypeIdsRouteOption &
    EventBrokenBlockTypeIdsRouteOption &
    EventItemTypeIdsRouteOption &
    EventBeforeItemTypeIdsRouteOption
>;

/// Public API ///

export const breakBlock = (
  action: Action,
  routes?: PlayerBreakBlockAfterEventRouteOptions,
): EventRouteController => {
  router ??= new BasicEventRouter<Action, EventActionData<Action>>();

  listener ??= new BasicEventListener({
    signal: world.afterEvents.playerBreakBlock,
    callback(context) {
      // Global routes
      const global = router!.routes[EVENT_ROUTE_GLOBAL_ID];
      if (global !== undefined) {
        for (let i = 0; i < global.length; i++) {
          global[i].action(context);
        }
      }

      // Specific routes
      const combos = router!.getByEventParams(
        `${EventRoutePrefix.BlockTypeId}@${context.block.typeId}`,
        `${EventRoutePrefix.BrokenBlockTypeId}@${context.brokenBlockPermutation.type.id}`,
        `${EventRoutePrefix.ItemTypeId}@${context.itemStackAfterBreak?.typeId ?? 'empty'}`,
        `${EventRoutePrefix.BeforeItemTypeId}@${context.itemStackBeforeBreak?.typeId ?? 'empty'}`,
      );
      for (let i = 0; i < combos.length; i++) {
        combos[i].action(context);
      }
    },
  });

  return ArtifexEventUtils.initializeEvent<
    PlayerBreakBlockAfterEvent,
    PlayerBreakBlockAfterEventRouteOptions
  >(listener, router, action, routes);
};

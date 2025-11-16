import { PlayerInteractWithBlockAfterEvent, world } from '@minecraft/server';

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
  EventItemTypeIdsRouteOption,
  EventRouteController,
} from '@artifex/events/common/interfaces';
import { EventAction, EventActionData } from '@artifex/events/common/types';
import { ArtifexEventUtils } from '@artifex/events/common/utils';

/// Private Types ///

type Action = EventAction<PlayerInteractWithBlockAfterEvent>;

/// Private API ///

let router: BasicEventRouter<Action, EventActionData<Action>> | undefined;
let listener: BasicEventListener<PlayerInteractWithBlockAfterEvent> | undefined;

// Public Types ///

export type PlayerInteractWithBlockAfterEventRouteOptions = RequireAtLeastOne<
  EventBlockTypeIdsRouteOption &
    EventItemTypeIdsRouteOption &
    EventBeforeItemTypeIdsRouteOption
>;

/// Public API ///

export const interactWithBlock = (
  action: Action,
  routes?: PlayerInteractWithBlockAfterEventRouteOptions,
): EventRouteController => {
  router ??= new BasicEventRouter<Action, EventActionData<Action>>();

  listener ??= new BasicEventListener({
    signal: world.afterEvents.playerInteractWithBlock,
    callback(context) {
      const global = router!.routes[EVENT_ROUTE_GLOBAL_ID];
      if (global !== undefined) {
        for (let i = 0; i < global.length; i++) {
          global[i].action(context);
        }
      }

      const combos = router!.getByEventParams(
        `${EventRoutePrefix.BlockTypeId}@${context.block.typeId}`,
        `${EventRoutePrefix.ItemTypeId}@${context.itemStack?.typeId ?? 'empty'}`,
        `${EventRoutePrefix.BeforeItemTypeId}@${context.beforeItemStack?.typeId ?? 'empty'}`,
      );
      for (let i = 0; i < combos.length; i++) {
        combos[i].action(context);
      }
    },
  });

  return ArtifexEventUtils.initializeEvent<
    PlayerInteractWithBlockAfterEvent,
    PlayerInteractWithBlockAfterEventRouteOptions
  >(listener, router, action, routes);
};

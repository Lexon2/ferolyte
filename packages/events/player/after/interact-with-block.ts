import { PlayerInteractWithBlockAfterEvent, world } from '@minecraft/server';

import { RequireAtLeastOne } from '@ferolyte/common/types';
import { BasicEventListener } from '@ferolyte/events/common/basic-event.listener';
import { BasicEventRouter } from '@ferolyte/events/common/basic-event.router';
import {
  EVENT_ROUTE_GLOBAL_ID,
  EventRoutePrefix,
} from '@ferolyte/events/common/constants';
import {
  EventBeforeItemTypeIdsRouteOption,
  EventBlockTypeIdsRouteOption,
  EventItemTypeIdsRouteOption,
  EventRouteController,
} from '@ferolyte/events/common/interfaces';
import { EventAction, EventActionData } from '@ferolyte/events/common/types';
import { FerolyteEventUtils } from '@ferolyte/events/common/utils';

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

  return FerolyteEventUtils.initializeEvent<
    PlayerInteractWithBlockAfterEvent,
    PlayerInteractWithBlockAfterEventRouteOptions
  >(listener, router, action, routes);
};

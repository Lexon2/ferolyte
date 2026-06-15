import { ItemReleaseUseAfterEvent, world } from '@minecraft/server';

import { BasicEventListener } from '@ferolyte/events/common/basic-event.listener';
import { BasicEventRouter } from '@ferolyte/events/common/basic-event.router';
import {
  EVENT_ROUTE_GLOBAL_ID,
  EventRoutePrefix,
} from '@ferolyte/events/common/constants';
import { EventRouteController } from '@ferolyte/events/common/interfaces';
import { EventAction, EventActionData } from '@ferolyte/events/common/types';
import { FerolyteEventUtils } from '@ferolyte/events/common/utils';

import {
  ItemUseAfterEventRouteOptions,
  ItemUseEventWithPlayerContext,
} from './interfaces';

/// Private Types ///

interface Context
  extends
    Omit<ItemReleaseUseAfterEvent, 'source'>,
    ItemUseEventWithPlayerContext {}

type Action = EventAction<Context>;

/// Private API ///

let router: BasicEventRouter<Action, EventActionData<Action>> | undefined;
let listener: BasicEventListener<ItemReleaseUseAfterEvent> | undefined;

// Public API ///

export const itemReleaseUse = (
  action: Action,
  routes?: ItemUseAfterEventRouteOptions,
): EventRouteController => {
  router ??= new BasicEventRouter<Action, EventActionData<Action>>();

  listener ??= new BasicEventListener({
    signal: world.afterEvents.itemReleaseUse,
    callback(event) {
      const { source, itemStack, useDuration } = event;

      const context: Context = {
        player: source,
        itemStack,
        useDuration,
      };

      // Global routes
      const global = router!.routes[EVENT_ROUTE_GLOBAL_ID];
      if (global !== undefined) {
        for (let i = 0; i < global.length; i++) {
          global[i].action(context);
        }
      }

      // Specific routes
      const combos = router!.getByEventParams(
        `${EventRoutePrefix.ItemTypeId}@${itemStack?.typeId ?? 'empty'}`,
      );
      for (let i = 0; i < combos.length; i++) {
        combos[i].action(context);
      }
    },
  });

  return FerolyteEventUtils.initializeEvent<
    Context,
    ItemUseAfterEventRouteOptions
  >(listener, router, action, routes);
};

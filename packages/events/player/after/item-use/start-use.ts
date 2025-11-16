import { ItemStartUseAfterEvent, world } from '@minecraft/server';

import { BasicEventListener } from '@artifex/events/common/basic-event.listener';
import { BasicEventRouter } from '@artifex/events/common/basic-event.router';
import {
  EVENT_ROUTE_GLOBAL_ID,
  EventRoutePrefix,
} from '@artifex/events/common/constants';
import { EventRouteController } from '@artifex/events/common/interfaces';
import { EventAction, EventActionData } from '@artifex/events/common/types';
import { ArtifexEventUtils } from '@artifex/events/common/utils';

import {
  ItemUseAfterEventRouteOptions,
  ItemUseEventWithPlayerContext,
} from './interfaces';

/// Private Types ///

interface Context
  extends Omit<ItemStartUseAfterEvent, 'source'>,
    ItemUseEventWithPlayerContext {}

type Action = EventAction<Context>;

/// Private API ///

let router: BasicEventRouter<Action, EventActionData<Action>> | undefined;
let listener: BasicEventListener<ItemStartUseAfterEvent> | undefined;

// Public API ///

export const itemStartUse = (
  action: Action,
  routes?: ItemUseAfterEventRouteOptions,
): EventRouteController => {
  router ??= new BasicEventRouter<Action, EventActionData<Action>>();

  listener ??= new BasicEventListener({
    signal: world.afterEvents.itemStartUse,
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
        `${EventRoutePrefix.ItemTypeId}@${itemStack.typeId ?? 'empty'}`,
      );
      for (let i = 0; i < combos.length; i++) {
        combos[i].action(context);
      }
    },
  });

  return ArtifexEventUtils.initializeEvent<
    Context,
    ItemUseAfterEventRouteOptions
  >(listener, router, action, routes);
};

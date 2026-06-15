import { ItemStartUseOnAfterEvent, world } from '@minecraft/server';

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
  ItemUseEventWithPlayerContext,
  ItemUseOnAfterEventRouteOptions,
} from './interfaces';

/// Private Types ///

interface Context
  extends
    Omit<ItemStartUseOnAfterEvent, 'source'>,
    ItemUseEventWithPlayerContext {}

type Action = EventAction<Context>;

/// Private API ///

let router: BasicEventRouter<Action, EventActionData<Action>> | undefined;
let listener: BasicEventListener<ItemStartUseOnAfterEvent> | undefined;

// Public API ///

export const itemStartUseOn = (
  action: Action,
  routes?: ItemUseOnAfterEventRouteOptions,
): EventRouteController => {
  router ??= new BasicEventRouter<Action, EventActionData<Action>>();

  listener ??= new BasicEventListener({
    signal: world.afterEvents.itemStartUseOn,
    callback(event) {
      const { source, itemStack, block, blockFace } = event;
      const context: Context = {
        player: source,
        itemStack,
        block,
        blockFace,
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
        block.isValid ? `${EventRoutePrefix.BlockTypeId}@${block.typeId}` : '',
      );
      for (let i = 0; i < combos.length; i++) {
        combos[i].action(context);
      }
    },
  });

  return FerolyteEventUtils.initializeEvent<
    Context,
    ItemUseOnAfterEventRouteOptions
  >(listener, router, action, routes);
};

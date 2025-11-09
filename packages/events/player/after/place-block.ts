import { PlayerPlaceBlockAfterEvent, world } from '@minecraft/server';

import { RequireAtLeastOne } from '@artifex/common/types/object/require-at-least-one';
import { BasicEventListener } from '@artifex/events/common/basic-event.listener';
import { BasicEventRouter } from '@artifex/events/common/basic-event.router';
import {
  EVENT_ROUTE_GLOBAL_ID,
  EventRoutePrefix,
} from '@artifex/events/common/constants';
import {
  EventBlockTypeIdsRouteOption,
  EventRouteController,
} from '@artifex/events/common/interfaces';
import { EventAction, EventActionData } from '@artifex/events/common/types';
import { ArtifexEventUtils } from '@artifex/events/common/utils';

/// Private Types ///

interface Context extends PlayerPlaceBlockAfterEvent {}

type Action = EventAction<Context>;

/// Private API ///

let router: BasicEventRouter<Action, EventActionData<Action>> | undefined;
let listener: BasicEventListener<Context> | undefined;

// Public Types ///

export type PlayerPlaceBlockAfterEventRouteOptions =
  RequireAtLeastOne<EventBlockTypeIdsRouteOption>;

/// Public API ///

export const placeBlock = (
  action: Action,
  routes?: PlayerPlaceBlockAfterEventRouteOptions,
): EventRouteController => {
  router ??= new BasicEventRouter<Action, EventActionData<Action>>();

  listener ??= new BasicEventListener({
    signal: world.afterEvents.playerPlaceBlock,
    callback(context) {
      const global = router!.routes[EVENT_ROUTE_GLOBAL_ID];
      if (global !== undefined) {
        for (let i = 0; i < global.length; i++) {
          global[i].action(context);
        }
      }

      const combos = router!.getByEventParams(
        `${EventRoutePrefix.BlockTypeId}@${context.block.typeId}`,
      );
      for (let i = 0; i < combos.length; i++) {
        combos[i].action(context);
      }
    },
  });

  return ArtifexEventUtils.initializeEvent<
    Context,
    PlayerPlaceBlockAfterEventRouteOptions
  >(listener, router, action, routes);
};

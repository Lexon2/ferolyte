import { PlayerDimensionChangeAfterEvent, world } from '@minecraft/server';

import { RequireAtLeastOne } from '@artifex/common/types';
import { BasicEventListener } from '@artifex/events/common/basic-event.listener';
import { BasicEventRouter } from '@artifex/events/common/basic-event.router';
import {
  EVENT_ROUTE_GLOBAL_ID,
  EventRoutePrefix,
} from '@artifex/events/common/constants';
import {
  EventRouteController,
  EventDimensionFromToIdsRouteOption,
} from '@artifex/events/common/interfaces';
import { EventAction, EventActionData } from '@artifex/events/common/types';
import { ArtifexEventUtils } from '@artifex/events/common/utils';

/// Private Types ///

interface Context extends PlayerDimensionChangeAfterEvent {}

type Action = EventAction<Context>;

/// Private API ///

let router: BasicEventRouter<Action, EventActionData<Action>> | undefined;
let listener: BasicEventListener<Context> | undefined;

/// Public Types ///

export type PlayerDimensionChangeAfterEventRouteOptions =
  RequireAtLeastOne<EventDimensionFromToIdsRouteOption>;

// Public API ///

export const playerDimensionChange = (
  action: Action,
  options?: PlayerDimensionChangeAfterEventRouteOptions,
): EventRouteController => {
  router ??= new BasicEventRouter<Action, EventActionData<Action>>();

  listener ??= new BasicEventListener({
    signal: world.afterEvents.playerDimensionChange,
    callback(context) {
      // Global routes
      const global = router!.routes[EVENT_ROUTE_GLOBAL_ID];
      if (global !== undefined) {
        for (let i = 0; i < global.length; i++) {
          global[i].action(context);
        }
      }

      // Specific routes (if needed, based on dimensions)
      const combos = router!.getByEventParams(
        `${EventRoutePrefix.FromDimensionId}@${context.fromDimension.id}`,
        `${EventRoutePrefix.ToDimensionId}@${context.toDimension.id}`,
      );
      for (let i = 0; i < combos.length; i++) {
        combos[i].action(context);
      }
    },
  });

  return ArtifexEventUtils.initializeEvent<
    Context,
    PlayerDimensionChangeAfterEventRouteOptions
  >(listener, router, action, options);
};

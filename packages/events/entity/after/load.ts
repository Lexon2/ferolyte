import { EntityLoadAfterEvent, world } from '@minecraft/server';

import { RequireAtLeastOne } from '@ferolyte/common/types';
import { BasicEventListener } from '@ferolyte/events/common/basic-event.listener';
import { BasicEventRouter } from '@ferolyte/events/common/basic-event.router';
import {
  EVENT_ROUTE_GLOBAL_ID,
  EventRoutePrefix,
} from '@ferolyte/events/common/constants';
import {
  EventEntityTypeIdsRouteOption,
  EventRouteController,
} from '@ferolyte/events/common/interfaces';
import { EventAction, EventActionData } from '@ferolyte/events/common/types';
import { FerolyteEventUtils } from '@ferolyte/events/common/utils';

/// Private Types ///

type Action = EventAction<EntityLoadAfterEvent>;

/// Private API ///

let router: BasicEventRouter<Action, EventActionData<Action>> | undefined;
let listener: BasicEventListener<EntityLoadAfterEvent> | undefined;

// Public Types ///

export type EntityLoadAfterEventRouteOptions =
  RequireAtLeastOne<EventEntityTypeIdsRouteOption>;

// Public API ///

export const entityLoad = (
  action: Action,
  routes?: EntityLoadAfterEventRouteOptions,
): EventRouteController => {
  router ??= new BasicEventRouter<Action, EventActionData<Action>>();

  listener ??= new BasicEventListener({
    signal: world.afterEvents.entityLoad,
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
        `${EventRoutePrefix.EntityTypeId}@${context.entity.typeId}`,
      );
      for (let i = 0; i < combos.length; i++) {
        combos[i].action(context);
      }
    },
  });

  return FerolyteEventUtils.initializeEvent<
    EntityLoadAfterEvent,
    EntityLoadAfterEventRouteOptions
  >(listener, router, action, routes);
};

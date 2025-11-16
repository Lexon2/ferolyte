import { EntityHurtAfterEvent, world } from '@minecraft/server';

import { RequireAtLeastOne } from '@artifex/common/types';
import { BasicEventListener } from '@artifex/events/common/basic-event.listener';
import { BasicEventRouter } from '@artifex/events/common/basic-event.router';
import {
  EVENT_ROUTE_GLOBAL_ID,
  EventRoutePrefix,
} from '@artifex/events/common/constants';
import {
  EventEntityTypeIdsRouteOption,
  EventRouteController,
} from '@artifex/events/common/interfaces';
import { EventAction, EventActionData } from '@artifex/events/common/types';
import { ArtifexEventUtils } from '@artifex/events/common/utils';

/// Private Types ///

type Action = EventAction<EntityHurtAfterEvent>;

/// Private API ///

let router: BasicEventRouter<Action, EventActionData<Action>> | undefined;
let listener: BasicEventListener<EntityHurtAfterEvent> | undefined;

// Public Types ///

export type EntityHurtAfterEventRouteOptions =
  RequireAtLeastOne<EventEntityTypeIdsRouteOption>;

// Public API ///

export const entityHurt = (
  action: Action,
  routes?: EntityHurtAfterEventRouteOptions,
): EventRouteController => {
  router ??= new BasicEventRouter<Action, EventActionData<Action>>();

  listener ??= new BasicEventListener({
    signal: world.afterEvents.entityHurt,
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
        `${EventRoutePrefix.EntityTypeId}@${context.hurtEntity.typeId}`,
      );
      for (let i = 0; i < combos.length; i++) {
        combos[i].action(context);
      }
    },
  });

  return ArtifexEventUtils.initializeEvent<
    EntityHurtAfterEvent,
    EntityHurtAfterEventRouteOptions
  >(listener, router, action, routes);
};

import { EntityHitEntityAfterEvent, world } from '@minecraft/server';

import { RequireAtLeastOne } from '@ferolyte/common/types';
import { BasicEventListener } from '@ferolyte/events/common/basic-event.listener';
import { BasicEventRouter } from '@ferolyte/events/common/basic-event.router';
import {
  EVENT_ROUTE_GLOBAL_ID,
  EventRoutePrefix,
} from '@ferolyte/events/common/constants';
import {
  EventDamagerTypeIdsRouteOption,
  EventEntityTypeIdsRouteOption,
  EventRouteController,
} from '@ferolyte/events/common/interfaces';
import { EventAction, EventActionData } from '@ferolyte/events/common/types';
import { FerolyteEventUtils } from '@ferolyte/events/common/utils';

/// Private Types ///

type Action = EventAction<EntityHitEntityAfterEvent>;

/// Private API ///

let router: BasicEventRouter<Action, EventActionData<Action>> | undefined;
let listener: BasicEventListener<EntityHitEntityAfterEvent> | undefined;

/// Public Types ///

export type EntityHitEntityAfterEventRouteOptions = RequireAtLeastOne<
  EventEntityTypeIdsRouteOption & EventDamagerTypeIdsRouteOption
>;

// Public API ///

export const hitEntity = (
  action: Action,
  routes?: EntityHitEntityAfterEventRouteOptions,
): EventRouteController => {
  router ??= new BasicEventRouter<Action, EventActionData<Action>>();
  listener ??= new BasicEventListener({
    signal: world.afterEvents.entityHitEntity,
    callback(event) {
      // Global routes
      const global = router!.routes[EVENT_ROUTE_GLOBAL_ID];
      if (global !== undefined) {
        for (let i = 0; i < global.length; i++) {
          global[i].action(event);
        }
      }

      // Specific routes
      const combos = router!.getByEventParams(
        `${EventRoutePrefix.EntityTypeId}@${event.hitEntity.typeId}`,
        `${EventRoutePrefix.DamagerTypeId}@${event.damagingEntity.typeId}`,
      );
      for (let i = 0; i < combos.length; i++) {
        combos[i].action(event);
      }
    },
  });

  return FerolyteEventUtils.initializeEvent<
    EntityHitEntityAfterEvent,
    EntityHitEntityAfterEventRouteOptions
  >(listener, router, action, routes);
};

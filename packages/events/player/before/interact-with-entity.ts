import {
  Entity,
  PlayerInteractWithEntityBeforeEvent,
  world,
} from '@minecraft/server';

import { RequireAtLeastOne } from '@artifex/common/types';
import { BasicEventListener } from '@artifex/events/common/basic-event.listener';
import { BasicEventRouter } from '@artifex/events/common/basic-event.router';
import {
  EVENT_ROUTE_GLOBAL_ID,
  EventRoutePrefix,
} from '@artifex/events/common/constants';
import {
  EventEntityTypeIdsRouteOption,
  EventItemTypeIdsRouteOption,
  EventRouteController,
} from '@artifex/events/common/interfaces';
import { EventAction, EventActionData } from '@artifex/events/common/types';
import { ArtifexEventUtils } from '@artifex/events/common/utils';

/// Private Types ///

interface Context extends Omit<PlayerInteractWithEntityBeforeEvent, 'target'> {
  entity: Entity;
  cancel: boolean;
}

type Action = EventAction<Context>;

/// Private API ///

let router: BasicEventRouter<Action, EventActionData<Action>> | undefined;
let listener:
  | BasicEventListener<PlayerInteractWithEntityBeforeEvent>
  | undefined;

// Public Types ///

export type PlayerInteractWithEntityBeforeEventRouteOptions = RequireAtLeastOne<
  EventEntityTypeIdsRouteOption & EventItemTypeIdsRouteOption
>;

/// Public API ///

export const interactWithEntity = (
  action: Action,
  routes?: PlayerInteractWithEntityBeforeEventRouteOptions,
): EventRouteController => {
  router ??= new BasicEventRouter<Action, EventActionData<Action>>();

  listener ??= new BasicEventListener({
    signal: world.beforeEvents.playerInteractWithEntity,
    callback(event) {
      const { target, itemStack, player } = event;

      const context: Context = {
        entity: target,
        itemStack,
        player,
        get cancel() {
          return event.cancel;
        },
        set cancel(value: boolean) {
          event.cancel = value;
        },
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
        `${EventRoutePrefix.EntityTypeId}@${target.typeId}`,
        `${EventRoutePrefix.ItemTypeId}@${itemStack?.typeId ?? 'empty'}`,
      );
      for (let i = 0; i < combos.length; i++) {
        combos[i].action(context);
      }
    },
  });

  return ArtifexEventUtils.initializeEvent<
    Context,
    PlayerInteractWithEntityBeforeEventRouteOptions
  >(listener, router, action, routes);
};

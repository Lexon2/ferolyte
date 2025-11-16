import { EffectAddAfterEvent, world } from '@minecraft/server';

import { RequireAtLeastOne } from '@artifex/common/types';
import {
  EventEffectTypeIdsRouteOption,
  EventEntityTypeIdsRouteOption,
  EventRouteController,
} from '@artifex/events/common';
import { BasicEventListener } from '@artifex/events/common/basic-event.listener';
import { BasicEventRouter } from '@artifex/events/common/basic-event.router';
import {
  EVENT_ROUTE_GLOBAL_ID,
  EventRoutePrefix,
} from '@artifex/events/common/constants';
import { EventAction, EventActionData } from '@artifex/events/common/types';
import { ArtifexEventUtils } from '@artifex/events/common/utils';

/// Private Types ///

type Action = EventAction<EffectAddAfterEvent>;

/// Private API ///

let router: BasicEventRouter<Action, EventActionData<Action>> | undefined;
let listener: BasicEventListener<EffectAddAfterEvent> | undefined;

/// Public Types ///

export type AddEffectAfterEventRouteOptions = RequireAtLeastOne<
  EventEntityTypeIdsRouteOption & EventEffectTypeIdsRouteOption
>;

// Public API ///

export const addEffect = (
  action: Action,
  routes?: AddEffectAfterEventRouteOptions,
): EventRouteController => {
  router ??= new BasicEventRouter<Action, EventActionData<Action>>();
  listener ??= new BasicEventListener({
    signal: world.afterEvents.effectAdd,
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
        `${EventRoutePrefix.EffectTypeId}@minecraft:${context.effect.typeId}`,
      );
      for (let i = 0; i < combos.length; i++) {
        combos[i].action(context);
      }
    },
  });

  return ArtifexEventUtils.initializeEvent(listener, router, action, routes);
};

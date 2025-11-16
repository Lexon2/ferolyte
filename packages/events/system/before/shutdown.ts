import { system, ShutdownEvent } from '@minecraft/server';

import { BasicEventListener } from '@artifex/events/common/basic-event.listener';
import { BasicEventRouter } from '@artifex/events/common/basic-event.router';
import { EVENT_ROUTE_GLOBAL_ID } from '@artifex/events/common/constants';
import { EventRouteController } from '@artifex/events/common/interfaces';
import { EventAction, EventActionData } from '@artifex/events/common/types';
import { ArtifexEventUtils } from '@artifex/events/common/utils';

/// Private Types ///

type Action = EventAction<ShutdownEvent>;

/// Private API ///

let router: BasicEventRouter<Action, EventActionData<Action>> | undefined;
let listener: BasicEventListener<ShutdownEvent> | undefined;

// Public API ///

/**
 * Fires the action when the system is shutting down.
 *
 * @param action - The action to perform when the system is shutting down.
 * @returns - EventRouteController
 */
export const shutdown = (action: Action): EventRouteController => {
  router ??= new BasicEventRouter<Action, EventActionData<Action>>();
  listener ??= new BasicEventListener({
    signal: system.beforeEvents.shutdown,
    callback(context) {
      // Global routes
      const global = router?.routes[EVENT_ROUTE_GLOBAL_ID];
      if (global !== undefined) {
        for (let i = 0; i < global.length; i++) {
          global[i].action(context);
        }
      }
    },
  });

  return ArtifexEventUtils.initializeEvent(listener, router, action);
};

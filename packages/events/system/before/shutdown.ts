import { system, ShutdownEvent } from '@minecraft/server';

import { BasicEventListener } from '@ferolyte/events/common/basic-event.listener';
import { BasicEventRouter } from '@ferolyte/events/common/basic-event.router';
import { EVENT_ROUTE_GLOBAL_ID } from '@ferolyte/events/common/constants';
import { EventRouteController } from '@ferolyte/events/common/interfaces';
import { EventAction, EventActionData } from '@ferolyte/events/common/types';
import { FerolyteEventUtils } from '@ferolyte/events/common/utils';

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

  return FerolyteEventUtils.initializeEvent(listener, router, action);
};

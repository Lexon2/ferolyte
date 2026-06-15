import { system, StartupEvent } from '@minecraft/server';

import { BasicEventListener } from '@ferolyte/events/common/basic-event.listener';
import { BasicEventRouter } from '@ferolyte/events/common/basic-event.router';
import { EVENT_ROUTE_GLOBAL_ID } from '@ferolyte/events/common/constants';
import { EventRouteController } from '@ferolyte/events/common/interfaces';
import { EventAction, EventActionData } from '@ferolyte/events/common/types';
import { FerolyteEventUtils } from '@ferolyte/events/common/utils';

/// Private Types ///

type Action = EventAction<StartupEvent>;

/// Private API ///

let router: BasicEventRouter<Action, EventActionData<Action>> | undefined;
let listener: BasicEventListener<StartupEvent> | undefined;
let loaded = false;

// Public API ///

/**
 * Fires the action when the system is starting up.
 * If the system is already starting up, the action is not fired.
 *
 * @param action - The action to perform when the system is starting up.
 * @returns - EventRouteController
 */
export const startup = (action: Action): EventRouteController | undefined => {
  if (loaded) {
    return;
  }

  router ??= new BasicEventRouter<Action, EventActionData<Action>>();
  listener ??= new BasicEventListener({
    signal: system.beforeEvents.startup,
    callback(context) {
      loaded = true;

      // Global routes
      const global = router?.routes[EVENT_ROUTE_GLOBAL_ID];
      if (global !== undefined) {
        for (let i = 0; i < global.length; i++) {
          global[i].action(context);
        }
      }

      listener?.mute();
      listener = undefined;
      router = undefined;
    },
  });

  return FerolyteEventUtils.initializeEvent(listener, router, action);
};

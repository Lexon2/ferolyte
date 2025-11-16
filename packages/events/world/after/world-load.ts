import { world, WorldLoadAfterEvent } from '@minecraft/server';

import { BasicEventListener } from '@artifex/events/common/basic-event.listener';
import { BasicEventRouter } from '@artifex/events/common/basic-event.router';
import { EVENT_ROUTE_GLOBAL_ID } from '@artifex/events/common/constants';
import { EventRouteController } from '@artifex/events/common/interfaces';
import { EventAction, EventActionData } from '@artifex/events/common/types';
import { ArtifexEventUtils } from '@artifex/events/common/utils';

/// Private Types ///

type Action = EventAction<WorldLoadAfterEvent>;

/// Private API ///

let router: BasicEventRouter<Action, EventActionData<Action>> | undefined;
let listener: BasicEventListener<WorldLoadAfterEvent> | undefined;
let loaded = false;

// Public API ///

/**
 * Fires the action when the world is loaded.
 * If the world is already loaded, the action is fired immediately.
 * @param action - The action to perform when the world is loaded.
 * @returns - EventRouteController
 */
export const worldLoad = (action: Action): EventRouteController | undefined => {
  if (loaded) {
    action({});

    return;
  }

  if (!router || !listener) {
    router ??= new BasicEventRouter<Action, EventActionData<Action>>();

    listener ??= new BasicEventListener({
      signal: world.afterEvents.worldLoad,
      callback(context) {
        // Global routes
        loaded = true;
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
  }

  return ArtifexEventUtils.initializeEvent(listener, router, action);
};

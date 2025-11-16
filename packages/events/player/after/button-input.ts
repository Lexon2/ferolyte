import { PlayerButtonInputAfterEvent, world } from '@minecraft/server';

import { BasicEventListener } from '@artifex/events/common/basic-event.listener';
import { BasicEventRouter } from '@artifex/events/common/basic-event.router';
import { EVENT_ROUTE_GLOBAL_ID } from '@artifex/events/common/constants';
import { EventRouteController } from '@artifex/events/common/interfaces';
import { EventAction, EventActionData } from '@artifex/events/common/types';
import { ArtifexEventUtils } from '@artifex/events/common/utils';

/// Private Types ///

interface Context extends PlayerButtonInputAfterEvent {}

type Action = EventAction<Context>;

/// Private API ///

let router: BasicEventRouter<Action, EventActionData<Action>> | undefined;
let listener: BasicEventListener<Context> | undefined;

// Public API ///

export const buttonInput = (action: Action): EventRouteController => {
  router ??= new BasicEventRouter<Action, EventActionData<Action>>();

  listener ??= new BasicEventListener({
    signal: world.afterEvents.playerButtonInput,
    callback(context) {
      // Global routes
      const global = router!.routes[EVENT_ROUTE_GLOBAL_ID];
      if (global !== undefined) {
        for (let i = 0; i < global.length; i++) {
          global[i].action(context);
        }
      }

      // No specific routes for button input event
    },
  });

  return ArtifexEventUtils.initializeEvent<Context, never>(
    listener,
    router,
    action,
  );
};

import { TargetBlockHitAfterEvent, world } from '@minecraft/server';

import { BasicEventListener } from '@ferolyte/events/common/basic-event.listener';
import { BasicEventRouter } from '@ferolyte/events/common/basic-event.router';
import { EVENT_ROUTE_GLOBAL_ID } from '@ferolyte/events/common/constants';
import { EventRouteController } from '@ferolyte/events/common/interfaces';
import { EventAction, EventActionData } from '@ferolyte/events/common/types';
import { FerolyteEventUtils } from '@ferolyte/events/common/utils';

/// Private Types ///

type Action = EventAction<TargetBlockHitAfterEvent>;

/// Private API ///

let router: BasicEventRouter<Action, EventActionData<Action>> | undefined;
let listener: BasicEventListener<TargetBlockHitAfterEvent> | undefined;

// Public API ///

export const targetBlockHit = (action: Action): EventRouteController => {
  router ??= new BasicEventRouter<Action, EventActionData<Action>>();

  listener ??= new BasicEventListener({
    signal: world.afterEvents.targetBlockHit,
    callback(context) {
      // Global routes
      const global = router!.routes[EVENT_ROUTE_GLOBAL_ID];
      if (global !== undefined) {
        for (let i = 0; i < global.length; i++) {
          global[i].action(context);
        }
      }
    },
  });

  return FerolyteEventUtils.initializeEvent(listener, router, action);
};

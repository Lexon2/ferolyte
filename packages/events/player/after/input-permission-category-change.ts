import {
  PlayerInputPermissionCategoryChangeAfterEvent,
  world,
} from '@minecraft/server';

import { BasicEventListener } from '@artifex/events/common/basic-event.listener';
import { BasicEventRouter } from '@artifex/events/common/basic-event.router';
import { EVENT_ROUTE_GLOBAL_ID } from '@artifex/events/common/constants';
import { EventRouteController } from '@artifex/events/common/interfaces';
import { EventAction, EventActionData } from '@artifex/events/common/types';
import { ArtifexEventUtils } from '@artifex/events/common/utils';

/// Private Types ///

interface Context extends PlayerInputPermissionCategoryChangeAfterEvent {}

type Action = EventAction<Context>;

/// Private API ///

let router: BasicEventRouter<Action, EventActionData<Action>> | undefined;
let listener: BasicEventListener<Context> | undefined;

// Public API ///

export const inputPermissionCategoryChange = (
  action: Action,
): EventRouteController => {
  router ??= new BasicEventRouter<Action, EventActionData<Action>>();

  listener ??= new BasicEventListener({
    signal: world.afterEvents.playerInputPermissionCategoryChange,
    callback(context) {
      const global = router!.routes[EVENT_ROUTE_GLOBAL_ID];
      if (global !== undefined) {
        for (let i = 0; i < global.length; i++) {
          global[i].action(context);
        }
      }
    },
  });

  return ArtifexEventUtils.initializeEvent<Context, never>(
    listener,
    router,
    action,
  );
};

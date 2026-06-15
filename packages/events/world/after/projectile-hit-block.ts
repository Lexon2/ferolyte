import {
  BlockHitInformation,
  ProjectileHitBlockAfterEvent,
  world,
} from '@minecraft/server';

import { RequireAtLeastOne } from '@ferolyte/common/types';
import { BasicEventListener } from '@ferolyte/events/common/basic-event.listener';
import { BasicEventRouter } from '@ferolyte/events/common/basic-event.router';
import {
  EVENT_ROUTE_GLOBAL_ID,
  EventRoutePrefix,
} from '@ferolyte/events/common/constants';
import {
  EventBlockTypeIdsRouteOption,
  EventProjectileTypeIdsRouteOption,
  EventRouteController,
} from '@ferolyte/events/common/interfaces';
import { EventAction, EventActionData } from '@ferolyte/events/common/types';
import { FerolyteEventUtils } from '@ferolyte/events/common/utils';

/// Private Types ///

interface Context
  extends
    Omit<ProjectileHitBlockAfterEvent, 'getBlockHit'>,
    BlockHitInformation {}

type Action = EventAction<Context>;

/// Private API ///

let router: BasicEventRouter<Action, EventActionData<Action>> | undefined;
let listener: BasicEventListener<ProjectileHitBlockAfterEvent> | undefined;

/// Public Types ///

export type ProjectileHitBlockAfterEventRouteOptions = RequireAtLeastOne<
  EventProjectileTypeIdsRouteOption & EventBlockTypeIdsRouteOption
>;

// Public API ///

export const projectileHitBlock = (
  action: Action,
  routes?: ProjectileHitBlockAfterEventRouteOptions,
): EventRouteController => {
  router ??= new BasicEventRouter<Action, EventActionData<Action>>();

  listener ??= new BasicEventListener({
    signal: world.afterEvents.projectileHitBlock,
    callback(event) {
      const { dimension, hitVector, location, projectile, source } = event;
      const { block, face, faceLocation } = event.getBlockHit();
      const context: Context = {
        dimension,
        hitVector,
        location,
        projectile,
        source,
        block,
        face,
        faceLocation,
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
        block.isValid ? `${EventRoutePrefix.BlockTypeId}@${block.typeId}` : '',
        `${EventRoutePrefix.ProjectileTypeId}@${context.projectile.typeId}`,
      );
      for (let i = 0; i < combos.length; i++) {
        combos[i].action(context);
      }
    },
  });

  return FerolyteEventUtils.initializeEvent(listener, router, action, routes);
};

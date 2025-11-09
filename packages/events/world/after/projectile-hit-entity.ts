import {
  Entity,
  ProjectileHitEntityAfterEvent,
  world,
} from '@minecraft/server';

import { RequireAtLeastOne } from '@artifex/common/types';
import {
  EventEntityTypeIdsRouteOption,
  EventProjectileTypeIdsRouteOption,
} from '@artifex/events/common';
import { BasicEventListener } from '@artifex/events/common/basic-event.listener';
import { BasicEventRouter } from '@artifex/events/common/basic-event.router';
import {
  EVENT_ROUTE_GLOBAL_ID,
  EventRoutePrefix,
} from '@artifex/events/common/constants';
import { EventRouteController } from '@artifex/events/common/interfaces';
import { EventAction, EventActionData } from '@artifex/events/common/types';
import { ArtifexEventUtils } from '@artifex/events/common/utils';

/// Private Types ///

interface Context extends Omit<ProjectileHitEntityAfterEvent, 'getEntityHit'> {
  entity?: Entity;
}

type Action = EventAction<Context>;

/// Private API ///

let router: BasicEventRouter<Action, EventActionData<Action>> | undefined;
let listener: BasicEventListener<ProjectileHitEntityAfterEvent> | undefined;

/// Public Types ///

export type ProjectileHitEntityAfterEventRouteOptions = RequireAtLeastOne<
  EventProjectileTypeIdsRouteOption & EventEntityTypeIdsRouteOption
>;

// Public API ///

export const projectileHitEntity = (
  action: Action,
  routes?: ProjectileHitEntityAfterEventRouteOptions,
): EventRouteController => {
  router ??= new BasicEventRouter<Action, EventActionData<Action>>();

  listener ??= new BasicEventListener({
    signal: world.afterEvents.projectileHitEntity,
    callback(event) {
      const { dimension, hitVector, location, projectile, source } = event;

      const entity = event.getEntityHit().entity;
      const context: Context = {
        dimension,
        hitVector,
        location,
        projectile,
        source,
        entity,
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
        `${EventRoutePrefix.EntityTypeId}@${entity?.typeId}`,
        `${EventRoutePrefix.ProjectileTypeId}@${projectile.typeId}`,
      );
      for (let i = 0; i < combos.length; i++) {
        combos[i].action(context);
      }
    },
  });

  return ArtifexEventUtils.initializeEvent(listener, router, action, routes);
};

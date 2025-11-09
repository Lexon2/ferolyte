import {
  Block,
  Entity,
  EntityHitBlockAfterEvent,
  world,
} from '@minecraft/server';

import { RequireAtLeastOne } from '@artifex/common/types';
import { BasicEventListener } from '@artifex/events/common/basic-event.listener';
import { BasicEventRouter } from '@artifex/events/common/basic-event.router';
import {
  EVENT_ROUTE_GLOBAL_ID,
  EventRoutePrefix,
} from '@artifex/events/common/constants';
import {
  EventBlockTypeIdsRouteOption,
  EventEntityTypeIdsRouteOption,
  EventRouteController,
} from '@artifex/events/common/interfaces';
import { EventAction, EventActionData } from '@artifex/events/common/types';
import { ArtifexEventUtils } from '@artifex/events/common/utils';

/// Private Types ///

interface Context
  extends Omit<EntityHitBlockAfterEvent, 'damagingEntity' | 'hitBlock'> {
  entity: Entity;
  block: Block;
}

type Action = EventAction<Context>;

/// Private API ///

let router: BasicEventRouter<Action, EventActionData<Action>> | undefined;
let listener: BasicEventListener<EntityHitBlockAfterEvent> | undefined;

/// Public Types ///

export type EntityHitBlockAfterEventRouteOptions = RequireAtLeastOne<
  EventEntityTypeIdsRouteOption & EventBlockTypeIdsRouteOption
>;

// Public API ///

export const hitBlock = (
  action: Action,
  routes?: EntityHitBlockAfterEventRouteOptions,
): EventRouteController => {
  router ??= new BasicEventRouter<Action, EventActionData<Action>>();
  listener ??= new BasicEventListener({
    signal: world.afterEvents.entityHitBlock,
    callback(event) {
      const { blockFace, damagingEntity, hitBlock, hitBlockPermutation } =
        event;
      const context: Context = {
        entity: damagingEntity,
        block: hitBlock,
        hitBlockPermutation,
        blockFace,
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
        `${EventRoutePrefix.EntityTypeId}@${damagingEntity.typeId}`,
        `${EventRoutePrefix.BlockTypeId}@${hitBlock.typeId}`,
      );
      for (let i = 0; i < combos.length; i++) {
        combos[i].action(context);
      }
    },
  });

  return ArtifexEventUtils.initializeEvent<
    Context,
    EntityHitBlockAfterEventRouteOptions
  >(listener, router, action, routes);
};

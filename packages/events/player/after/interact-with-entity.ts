import {
  Entity,
  ItemStack,
  PlayerInteractWithEntityAfterEvent,
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
  EventBeforeItemTypeIdsRouteOption,
  EventEntityTypeIdsRouteOption,
  EventItemTypeIdsRouteOption,
  EventRouteController,
} from '@ferolyte/events/common/interfaces';
import { EventAction, EventActionData } from '@ferolyte/events/common/types';
import { FerolyteEventUtils } from '@ferolyte/events/common/utils';

/// Private Types ///

type ItemStackType<T extends PlayerInteractWithEntityAfterEventRouteOptions> =
  T extends { itemTypeId: infer U }
    ? U extends string[]
      ? ItemStack
      : ItemStack | undefined
    : ItemStack | undefined;

interface Context<
  T extends PlayerInteractWithEntityAfterEventRouteOptions =
    PlayerInteractWithEntityAfterEventRouteOptions,
> extends Omit<PlayerInteractWithEntityAfterEvent, 'target' | 'itemStack'> {
  entity: Entity;
  itemStack: ItemStackType<T>;
}

type Action<
  T extends PlayerInteractWithEntityAfterEventRouteOptions =
    PlayerInteractWithEntityAfterEventRouteOptions,
> = EventAction<Context<T>>;

/// Private API ///

let router: BasicEventRouter<Action, EventActionData<Action>> | undefined;
let listener:
  | BasicEventListener<PlayerInteractWithEntityAfterEvent>
  | undefined;

// Public Types ///

export type PlayerInteractWithEntityAfterEventRouteOptions = RequireAtLeastOne<
  EventEntityTypeIdsRouteOption &
    EventItemTypeIdsRouteOption &
    EventBeforeItemTypeIdsRouteOption
>;

/// Public API ///

export const interactWithEntity = <
  T extends PlayerInteractWithEntityAfterEventRouteOptions,
>(
  action: Action<T>,
  routes?: T,
): EventRouteController => {
  router ??= new BasicEventRouter<Action, EventActionData<Action>>();

  listener ??= new BasicEventListener({
    signal: world.afterEvents.playerInteractWithEntity,
    callback(event) {
      const { target, player, beforeItemStack, itemStack } = event;
      const context: Context = {
        entity: target,
        player,
        itemStack,
        beforeItemStack,
      };

      const global = router!.routes[EVENT_ROUTE_GLOBAL_ID];
      if (global !== undefined) {
        for (let i = 0; i < global.length; i++) {
          global[i].action(context);
        }
      }

      const combos = router!.getByEventParams(
        `${EventRoutePrefix.EntityTypeId}@${target.typeId}`,
        `${EventRoutePrefix.ItemTypeId}@${itemStack?.typeId ?? 'empty'}`,
        `${EventRoutePrefix.BeforeItemTypeId}@${beforeItemStack?.typeId ?? 'empty'}`,
      );
      for (let i = 0; i < combos.length; i++) {
        combos[i].action(context);
      }
    },
  });

  return FerolyteEventUtils.initializeEvent<
    Context<T>,
    PlayerInteractWithEntityAfterEventRouteOptions
  >(listener, router, action, routes);
};

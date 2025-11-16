import {
  HotbarEventOptions,
  PlayerHotbarSelectedSlotChangeAfterEvent,
  world,
} from '@minecraft/server';

import { RequireAtLeastOne } from '@artifex/common/types';
import {
  EVENT_ROUTE_GLOBAL_ID,
  EventAction,
  EventActionData,
  EventItemTypeIdsRouteOption,
  EventRouteController,
  EventRoutePrefix,
} from '@artifex/events/common';
import { BasicEventListener } from '@artifex/events/common/basic-event.listener';
import { BasicEventRouter } from '@artifex/events/common/basic-event.router';
import { ArtifexEventUtils } from '@artifex/events/common/utils';

type Action = EventAction<Context>;
interface Context
  extends Omit<
    PlayerHotbarSelectedSlotChangeAfterEvent,
    'newSlotSelected' | 'previousSlotSelected'
  > {
  prevSlot: number;
  newSlot: number;
}

export type PlayerScrollHotbarEventRouteOptions = RequireAtLeastOne<
  {
    allowedSlots?: number[];
    toSlot?: number;
    fromSlot?: number;
  } & EventItemTypeIdsRouteOption
>;

/// Private API ///

let specificRouter:
  | BasicEventRouter<Action, EventActionData<Action>>
  | undefined;
let specificListener:
  | BasicEventListener<PlayerHotbarSelectedSlotChangeAfterEvent>
  | undefined;

let globalRouter: BasicEventRouter<Action, EventActionData<Action>> | undefined;
let globalListener:
  | BasicEventListener<PlayerHotbarSelectedSlotChangeAfterEvent>
  | undefined;

let eventOptions: EventOptions | undefined;

class EventOptions {
  public filter: HotbarEventOptions | undefined;

  public add(options: PlayerScrollHotbarEventRouteOptions) {
    this.filter ??= {};

    let slotAdded = false;
    if (options.allowedSlots) {
      slotAdded = true;
      this.filter.allowedSlots = [
        ...new Set([
          ...(this.filter.allowedSlots ?? []),
          ...options.allowedSlots,
        ]),
      ];
    }
    if (options.fromSlot) {
      slotAdded = true;
      this.filter.allowedSlots = [
        ...new Set([...(this.filter.allowedSlots ?? []), options.fromSlot]),
      ];
    }
    if (options.toSlot) {
      slotAdded = true;
      this.filter.allowedSlots = [
        ...new Set([...(this.filter.allowedSlots ?? []), options.toSlot]),
      ];
    }

    if (!slotAdded) {
      this.filter = undefined;
    }
  }

  public remove(options: PlayerScrollHotbarEventRouteOptions) {
    if (!this.filter) {
      return;
    }

    if (options.allowedSlots) {
      const set = new Set(this.filter.allowedSlots);
      for (const type of options.allowedSlots) {
        set.delete(type);
      }
      this.filter.allowedSlots = Array.from(set);
    }
    if (options.fromSlot) {
      const set = new Set(this.filter.allowedSlots);
      set.delete(options.fromSlot);
      this.filter.allowedSlots = Array.from(set);
    }
    if (options.toSlot) {
      const set = new Set(this.filter.allowedSlots);
      set.delete(options.toSlot);
      this.filter.allowedSlots = Array.from(set);
    }
  }
}

/// Public API ///

export function playerScrollHotbar(
  action: Action,
  routes?: PlayerScrollHotbarEventRouteOptions,
): EventRouteController {
  if (!routes) {
    globalRouter ??= new BasicEventRouter<Action, EventActionData<Action>>();
    globalListener ??= new BasicEventListener({
      signal: world.afterEvents.playerHotbarSelectedSlotChange,
      callback(event) {
        const {
          player,
          newSlotSelected: newSlot,
          previousSlotSelected: prevSlot,
          itemStack,
        } = event;

        const context: Context = {
          player,
          itemStack,
          newSlot,
          prevSlot,
        };

        const global = globalRouter!.routes[EVENT_ROUTE_GLOBAL_ID];
        if (global !== undefined) {
          for (let i = 0; i < global.length; i++) {
            global[i].action(context);
          }
        }
      },
    });

    return ArtifexEventUtils.initializeEvent(
      globalListener,
      globalRouter,
      action,
    );
  }

  eventOptions ??= new EventOptions();
  specificRouter ??= new BasicEventRouter<Action, EventActionData<Action>>();
  specificListener ??= new BasicEventListener({
    signal: world.afterEvents.playerHotbarSelectedSlotChange,
    callback(event) {
      const {
        player,
        newSlotSelected: newSlot,
        previousSlotSelected: prevSlot,
        itemStack,
      } = event;
      const context: Context = {
        player,
        itemStack,
        newSlot,
        prevSlot,
      };

      const combos = specificRouter!.getByEventParams(
        `${EventRoutePrefix.ItemTypeId}@${itemStack?.typeId ?? 'empty'}`,
        `${EventRoutePrefix.NextHotbarSlot}@${newSlot}`,
        `${EventRoutePrefix.PreviousHotbarSlot}@${prevSlot}`,
      );
      for (let i = 0; i < combos.length; i++) {
        combos[i].action(context);
      }
    },
  });

  const { open, close } = ArtifexEventUtils.initializeEvent<
    Context,
    Record<string, any>
  >(specificListener, specificRouter, action, {
    itemTypeId: routes?.itemTypeId,
    toSlot: [routes?.toSlot],
    fromSlot: [routes?.fromSlot],
  });

  const controller = {
    open: () => {
      open();

      if (routes) {
        eventOptions?.add(routes);
        if (specificListener) {
          specificListener.filter = eventOptions?.filter;
          specificListener.reload();
        }
      }
    },

    close: () => {
      if (routes) {
        eventOptions?.remove(routes);

        if (specificListener) {
          specificListener.filter = eventOptions?.filter;
          specificListener.reload();
        }
      }
      close();
    },
  };

  controller.open();

  return controller;
}

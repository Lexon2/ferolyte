import {
  DataDrivenEntityTriggerAfterEvent,
  EntityDataDrivenTriggerEventOptions,
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
  EventEntityTypeIdsRouteOption,
  EventIdsRouteOption,
  EventRouteController,
} from '@artifex/events/common/interfaces';
import { EventAction, EventActionData } from '@artifex/events/common/types';
import { ArtifexEventUtils } from '@artifex/events/common/utils';

/// Private Types ///

type Action = EventAction<DataDrivenEntityTriggerAfterEvent>;

/// Private API ///

let specificRouter:
  | BasicEventRouter<Action, EventActionData<Action>>
  | undefined;
let specificListener:
  | BasicEventListener<DataDrivenEntityTriggerAfterEvent>
  | undefined;

let globalListener:
  | BasicEventListener<DataDrivenEntityTriggerAfterEvent>
  | undefined;
let globalRouter: BasicEventRouter<Action, EventActionData<Action>> | undefined;

let eventOptions: EventOptions | undefined;

class EventOptions {
  public filter: EntityDataDrivenTriggerEventOptions | undefined;

  public add(options: DataDrivenEventTriggerAfterEventRouteOptions) {
    this.filter ??= {};

    if (options.entityTypeId) {
      this.filter.entityTypes = [
        ...new Set([
          ...(this.filter.entityTypes ?? []),
          ...options.entityTypeId,
        ]),
      ];
    }
    if (options.eventId) {
      this.filter.eventTypes = [
        ...new Set([...(this.filter.eventTypes ?? []), ...options.eventId]),
      ];
    }
  }

  public remove(options: DataDrivenEventTriggerAfterEventRouteOptions) {
    if (!this.filter) {
      return;
    }

    if (options.entityTypeId) {
      const set = new Set(this.filter.entityTypes);
      for (const type of options.entityTypeId) {
        set.delete(type);
      }
      this.filter.entityTypes = Array.from(set);
    }
    if (options.eventId) {
      const set = new Set(this.filter.eventTypes);
      for (const id of options.eventId) {
        set.delete(id);
      }
      this.filter.eventTypes = Array.from(set);
    }
  }
}

/// Public Types ///

export type DataDrivenEventTriggerAfterEventRouteOptions = RequireAtLeastOne<
  EventEntityTypeIdsRouteOption & EventIdsRouteOption
>;

// Public API ///

/**
 * Fires the action when an entity triggers a data-driven event.
 *
 * If no routes are specified, it will use the global router and listener.
 * But it will open a separate event channel for the global routes.
 * @remarks Global routes usage is not recommended. It could lead to performance issues.
 *
 * @param action - The action to perform when an entity triggers a data-driven event.
 * @param routes - The routes to use for the event.
 * @returns `EventRouteController` to control the event route.
 */
export const entityEventTrigger = (
  action: Action,
  routes?: DataDrivenEventTriggerAfterEventRouteOptions,
): EventRouteController => {
  // Open a separate event channel for the global routes.
  if (!routes) {
    globalRouter ??= new BasicEventRouter<Action, EventActionData<Action>>();
    globalListener ??= new BasicEventListener({
      signal: world.afterEvents.dataDrivenEntityTrigger,
      callback(context) {
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
    signal: world.afterEvents.dataDrivenEntityTrigger,
    callback(context) {
      const combos = specificRouter!.getByEventParams(
        `${EventRoutePrefix.EntityTypeId}@${context.entity.typeId}`,
        `${EventRoutePrefix.EventId}@${context.eventId}`,
      );
      for (let i = 0; i < combos.length; i++) {
        combos[i].action(context);
      }
    },
  });

  const { open, close } = ArtifexEventUtils.initializeEvent(
    specificListener,
    specificRouter,
    action,
    routes,
  );

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
};

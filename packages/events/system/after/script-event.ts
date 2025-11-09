/// Private Types ///

import {
  ScriptEventCommandMessageAfterEvent,
  ScriptEventSource,
  system,
} from '@minecraft/server';

import { RequireAtLeastOne } from '@artifex/common/types';
import {
  EventAction,
  EventActionData,
  EventActionPointer,
  EventBlockTypeIdsRouteOption,
  EventItemTypeIdsRouteOption,
  EventRouteController,
  ScriptEventCommandActionFromRouteOption,
  ScriptEventCommandRouteOption,
} from '@artifex/events/common';
import { BasicEventListener } from '@artifex/events/common/basic-event.listener';

/// Private Types ///

type Action = EventAction<ScriptEventCommandMessageAfterEvent>;

/// Private Constants ///

/// Private API ///

const namespaces: string[] = [];
const NAMESPACE_RECORD: Record<string, number> = {};

let listener:
  | BasicEventListener<ScriptEventCommandMessageAfterEvent>
  | undefined;
// const NAMESPACE_RECORD: NamespaceRecord = {
//   namespaces: [],
// };
let ROUTES: Record<string, EventActionData<Action>[]> | undefined;

/**
 * Wrap the action to handle errors and filter by message.
 */
const wrap = (action: Action, routeId: string, message?: string): Action => {
  if (!message) {
    return (context) => {
      try {
        action(context);
      } catch (err) {
        console.error(
          `[Artifex] Event route ${routeId} run with error in action:`,
          err,
        );
      }
    };
  } else {
    return (context) => {
      if (context.message !== message) {
        return;
      }

      try {
        action(context);
      } catch (err) {
        console.error(
          `[Artifex] Event route ${routeId} run with error in action:`,
          err,
        );
      }
    };
  }
};

const getRouteId = (route: ScriptEventCommandRouteOption): string => {
  const { id, source } = route;
  const prefixes = {
    [ScriptEventSource.Block]: 'b-',
    [ScriptEventSource.Entity]: 'e-',
    [ScriptEventSource.NPCDialogue]: 'e-',
    [ScriptEventSource.Server]: '',
    player: 'p-',
  };

  let suffix = '';
  switch (source) {
    case ScriptEventSource.Block:
      suffix = route.blockTypeId ? `-${route.blockTypeId}` : '';
      break;
    case 'player':
      suffix = '-minecraft:player';
      break;
    case ScriptEventSource.NPCDialogue:
    case ScriptEventSource.Entity:
      suffix = route.entityTypeId ? `-${route.entityTypeId}` : '';
      break;
    default:
      break;
  }

  return `${prefixes[source]}${id}${suffix}`;
};
/**
 * Add an action to the route.
 */
const add = <Route extends ScriptEventCommandRouteOption>(
  action: ScriptEventCommandActionFromRouteOption<Route>,
  route: Route,
): EventActionPointer => {
  const routeId = getRouteId(route);
  const routeData = (ROUTES![routeId] ??= []);
  const actionId = Date.now();

  routeData.push({
    id: actionId,
    action: wrap(action as Action, routeId, route.message),
  } as EventActionData<Action>);

  return { routeId, actionId };
};

/**
 * Remove an action from the route.
 */
const remove = (routeId: string, actionId: number) => {
  const route = ROUTES![routeId];
  if (!route) {
    return;
  }

  const index = route.findIndex((action) => action.id === actionId);
  if (index === -1) {
    return;
  }

  route.splice(index, 1);

  if (route.length === 0) {
    delete ROUTES![routeId];
  }
};

/**
 * Create a route controller for the action.
 * This controller will handle the opening and closing of the route.
 * It will also handle the namespace management.
 * If the namespace is not used anymore, it will be removed from the list.
 * If the namespace is used, it will be reloaded.
 */
const createRouteController = <Route extends ScriptEventCommandRouteOption>(
  action: ScriptEventCommandActionFromRouteOption<Route>,
  route: Route,
): EventRouteController => {
  const namespace = route.id.split(':')[0];
  const pointers: EventActionPointer = {
    routeId: '',
    actionId: 0,
  };

  const open = () => {
    const { routeId, actionId } = add(action as any, route);
    pointers.routeId = routeId;
    pointers.actionId = actionId;

    if (NAMESPACE_RECORD[namespace] === undefined) {
      namespaces.push(namespace);
      NAMESPACE_RECORD[namespace] = 1;
      listener?.reload();
    } else {
      NAMESPACE_RECORD[namespace]++;
      listener?.listen();
    }
  };

  const close = () => {
    const { routeId, actionId } = pointers;
    remove(routeId, actionId);

    let namespaceRemoved = false;
    const count = NAMESPACE_RECORD[namespace];

    if (count !== undefined && --NAMESPACE_RECORD[namespace] === 0) {
      const index = namespaces.indexOf(namespace);
      if (index !== -1) namespaces.splice(index, 1);
      delete NAMESPACE_RECORD[namespace];
      namespaceRemoved = true;
    }

    const empty = Object.keys(ROUTES!).length === 0 || namespaces.length === 0;
    if (empty) {
      listener?.mute();
    } else if (namespaceRemoved) {
      listener?.reload();
    }
  };

  open();

  return { open, close };
};

// Public Types ///

export type ScriptEventRouteOptions = RequireAtLeastOne<
  EventBlockTypeIdsRouteOption & EventItemTypeIdsRouteOption
>;

/// Public API ///

export const scriptEvent = <Route extends ScriptEventCommandRouteOption>(
  action: ScriptEventCommandActionFromRouteOption<Route>,
  route: Route,
): EventRouteController => {
  if (!listener || !ROUTES) {
    /**
     * Script event controller.
     * This controller will handle the script event actions.
     * It will handle the script event actions by type.
     */
    const scriptEventActionsByType = {
      /**
       * Handle server actions.
       */
      [ScriptEventSource.Server]: (
        context: ScriptEventCommandMessageAfterEvent,
      ) => {
        const actions = ROUTES![context.id];
        if (actions) {
          for (let i = 0; i < actions.length; i++) {
            actions[i].action(context);
          }
        }
      },
      /**
       * Handle entity actions.
       * This will handle both entity and player actions.
       */
      [ScriptEventSource.Entity]: (
        context: ScriptEventCommandMessageAfterEvent,
      ) => {
        const { id, message, sourceEntity } = context;
        if (!sourceEntity) {
          return;
        }
        const { typeId } = sourceEntity;

        const actions = ROUTES![`e-${id}`];
        if (actions !== undefined) {
          for (let i = 0; i < actions.length; i++) {
            actions[i].action({
              message,
              entity: sourceEntity,
            } as any);
          }
        }

        const concreteEntityActions = ROUTES![`e-${id}-${typeId}`];
        if (concreteEntityActions !== undefined) {
          for (let i = 0; i < concreteEntityActions.length; i++) {
            concreteEntityActions[i].action({
              message,
              entity: sourceEntity,
            } as any);
          }
        }

        const playerActions =
          typeId === 'minecraft:player'
            ? ROUTES![`p-${id}-minecraft:player`]
            : undefined;
        if (playerActions !== undefined) {
          for (let i = 0; i < playerActions.length; i++) {
            playerActions[i].action({
              message,
              player: sourceEntity,
            } as any);
          }
        }
      },
      /**
       * Handle NPC dialogue actions.
       */
      [ScriptEventSource.NPCDialogue]: (
        context: ScriptEventCommandMessageAfterEvent,
      ) => {
        const { id, message, sourceEntity } = context;
        if (!sourceEntity) {
          return;
        }

        const actions = ROUTES![`e-${id}-${sourceEntity.typeId}`];
        if (actions !== undefined) {
          for (let i = 0; i < actions.length; i++) {
            actions[i].action({
              message,
              entity: sourceEntity,
            } as any);
          }
        }
      },
      /**
       * Handle block actions.
       */
      [ScriptEventSource.Block]: (
        context: ScriptEventCommandMessageAfterEvent,
      ) => {
        const { id, message, sourceBlock } = context;
        if (!sourceBlock) {
          return;
        }

        const actions = ROUTES![`b-${id}-${sourceBlock.typeId}`];
        for (let i = 0; i < actions.length; i++) {
          actions[i].action({
            message,
            block: sourceBlock,
          } as any);
        }
      },
    };

    ROUTES = {};
    listener = new BasicEventListener({
      signal: system.afterEvents.scriptEventReceive,
      callback(context) {
        const actions = scriptEventActionsByType[context.sourceType];
        if (actions) {
          actions(context);
        }
      },
      filter: {
        namespaces,
      },
    });
  }

  return createRouteController(action, route);
};

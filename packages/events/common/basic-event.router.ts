import { EVENT_ROUTE_GLOBAL_ID } from './constants/event-route-global-id';
import { EventActionPointer } from './interfaces/event-action-pointer';
import { EventAction } from './types';
import { EventActionData } from './types/event-acton-data';

export interface EventRouterOptions {
  cache?: boolean;
}

export class BasicEventRouter<
  Action extends EventAction<any>,
  ActionData extends EventActionData<Action>,
> {
  private actionId: number = 0;
  public readonly routes: Record<string, ActionData[]>;

  constructor(options?: EventRouterOptions) {
    this.routes = {};

    if (options === undefined) {
      options = {
        cache: true,
      };
    }
    this.paramsCache = {};
  }

  public get size(): number {
    return Object.keys(this.routes).length;
  }

  /**
   * Adds an action to the route.
   * If the route doesn't exist, it will be created.
   * @param routeId - The ID of the route to add the action to.
   * @param action - The action to add to the route.
   * @returns A pointer to the added action.
   */
  public add(routeId: string, action: Action): EventActionPointer {
    const route = (this.routes[routeId] ??= []);
    const actionId = ++this.actionId;

    const wrapped = ((context) => {
      try {
        action(context);
      } catch (err) {
        console.error(
          `[Ferolyte] Event route ${routeId} run with error in action:`,
          err,
        );
      }
    }) as Action;

    route.push({
      id: actionId,
      action: wrapped,
    } as ActionData);

    return { routeId, actionId };
  }

  /**
   * Removes an action from the route.
   * If the route is empty after removing the action, it will be deleted.
   * @param pointer - The pointer to the action to remove.
   */
  public remove(pointer: EventActionPointer): void {
    const { routes } = this;
    const { routeId, actionId } = pointer;

    if (routes[routeId] === undefined) {
      return;
    }

    const route = routes[routeId];

    const index = route.findIndex((action) => action.id === actionId);
    if (index === -1) {
      return;
    }

    route.splice(index, 1);

    if (route.length === 0) {
      delete routes[routeId];
    }
  }

  /**
   * Gets the actions for the given event parameters.
   * @param params - The event parameters to get the actions for.
   * @returns An action data array of for the given event parameters.
   */
  private paramsCache: Record<string, string[]>;
  public getByEventParams(...params: string[]): ActionData[] {
    const { routes, paramsCache } = this;
    const result: ActionData[] = [];

    const n = params.length;
    if (n === 0) {
      const global = routes[EVENT_ROUTE_GLOBAL_ID];
      if (global !== undefined) {
        result.push(...global);
      }
      return result;
    }

    if (n === 1) {
      const route = routes[params[0]];
      if (route !== undefined) {
        result.push(...route);
      }
      return result;
    }

    if (n === 2) {
      params = params.sort();
      const combos = [params[0], params[1], `${params[0]}-${params[1]}`];
      for (let i = 0; i < combos.length; i++) {
        if (combos[i] in routes) {
          result.push(...routes[combos[i]]);
        }
      }

      return result;
    }

    params = params.sort();
    const paramsCacheKey = params.join('-');
    const cache = paramsCache[paramsCacheKey] ?? [];
    if (cache.length > 0) {
      for (let i = 0; i < cache.length; i++) {
        const route = routes[cache[i]];
        if (route !== undefined) {
          result.push(...route);
        }
      }

      return result;
    }

    for (let mask = 1; mask < 1 << n; mask++) {
      const combination: string[] = [];
      for (let i = 0; i < n; i++) {
        if (mask & (1 << i)) {
          combination.push(params[i]);
        }
      }

      const str = combination.sort().join('-');
      if (str in routes) {
        result.push(...routes[str]);
      }

      cache.push(str);
    }

    paramsCache[paramsCacheKey] = cache;

    return result;
  }
}

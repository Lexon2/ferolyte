import { BasicEventListener } from '@ferolyte/events/common/basic-event.listener';
import { BasicEventRouter } from '@ferolyte/events/common/basic-event.router';
import { EventAction, EventActionData } from '@ferolyte/events/common/types';
import {
  CartesianInput,
  CartesianProduct,
  cartesianMerge,
} from '@ferolyte/common/object/cartesian-merge';

import { FerolyteEventUtils } from '.';
import { EVENT_ROUTE_GLOBAL_ID } from '../constants';
import { EventActionPointer, EventRouteController } from '../interfaces';

export const initializeEvent = <
  EventContext,
  RouteOptions extends CartesianInput,
>(
  listener: BasicEventListener<any>,
  router: BasicEventRouter<
    EventAction<EventContext>,
    EventActionData<EventAction<EventContext>>
  >,
  action: EventAction<EventContext>,
  options?: RouteOptions,
): EventRouteController => {
  let isOpened = false;
  const pointers: EventActionPointer[] = [];
  const routes = (
    options ? cartesianMerge(options) : [EVENT_ROUTE_GLOBAL_ID]
  ) as CartesianProduct<RouteOptions>[];

  const open = () => {
    if (isOpened) {
      return;
    }

    isOpened = true;

    for (let i = 0; i < routes.length; i++) {
      // @TODO: Maybe there's a better way to handle types here
      const routeId = FerolyteEventUtils.generateRouteId(
        routes[i] as CartesianInput,
      );
      pointers.push(router.add(routeId, action));
    }
    listener.listen();
  };

  const close = () => {
    if (!isOpened) {
      return;
    }

    isOpened = false;

    for (let i = 0; i < pointers.length; i++) {
      router.remove(pointers[i]);
    }

    if (router.size === 0) {
      listener.mute();
    }
  };

  open();

  return { open, close };
};

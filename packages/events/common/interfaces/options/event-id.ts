export interface EventIdRouteOption {
  eventId: string;
}

export interface EventIdsRouteOption {
  eventId: EventIdRouteOption['eventId'][];
}

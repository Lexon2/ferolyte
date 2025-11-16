export interface EventItemTypeIdRouteOption {
  itemTypeId: string | 'empty';
}

export interface EventBeforeItemTypeIdRouteOption {
  beforeItemTypeId: string | 'empty';
}

export interface EventItemTypeIdsRouteOption {
  itemTypeId: EventItemTypeIdRouteOption['itemTypeId'][];
}

export interface EventBeforeItemTypeIdsRouteOption {
  beforeItemTypeId: EventBeforeItemTypeIdRouteOption['beforeItemTypeId'][];
}

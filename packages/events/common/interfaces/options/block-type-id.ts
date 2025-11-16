export interface EventBlockTypeIdRouteOption {
  blockTypeId: string;
}

export interface EventBrokenBlockTypeIdRouteOption {
  brokenBlockTypeId: string;
}

export interface EventBeforeBlockTypeIdRouteOption {
  beforeBlockTypeId: string;
}

export interface EventBlockTypeIdsRouteOption {
  blockTypeId: EventBlockTypeIdRouteOption['blockTypeId'][];
}

export interface EventBrokenBlockTypeIdsRouteOption {
  brokenBlockTypeId: EventBrokenBlockTypeIdRouteOption['brokenBlockTypeId'][];
}

export interface EventBeforeBlockTypeIdsRouteOption {
  beforeBlockTypeId: EventBeforeBlockTypeIdRouteOption['beforeBlockTypeId'][];
}

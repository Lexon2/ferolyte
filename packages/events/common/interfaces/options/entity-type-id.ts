export interface EventEntityTypeIdRouteOption {
  entityTypeId: string;
}

export interface EventEntityTypeIdsRouteOption {
  entityTypeId: EventEntityTypeIdRouteOption['entityTypeId'][];
}

export interface EventDamagerTypeIdRouteOption {
  damagerTypeId: string;
}

export interface EventDamagerTypeIdsRouteOption {
  damagerTypeId: EventDamagerTypeIdRouteOption['damagerTypeId'][];
}

export interface EventProjectileTypeIdRouteOption {
  projectileTypeId: string;
}

export interface EventProjectileTypeIdsRouteOption {
  projectileTypeId: EventProjectileTypeIdRouteOption['projectileTypeId'][];
}

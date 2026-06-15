import { CartesianInput } from '@ferolyte/common/object/cartesian-merge';

import { EVENT_ROUTE_GLOBAL_ID } from '../constants';
import { EventRoutePrefix } from '../constants/event-route-prefix';

export const generateRouteId = (options: CartesianInput): string => {
  const keys = Object.keys(options);
  if (keys.length === 0) {
    return EVENT_ROUTE_GLOBAL_ID;
  }
  const EVENT_ROUTE_PREFIXES: Record<string, EventRoutePrefix> = {
    blockTypeId: EventRoutePrefix.BlockTypeId,
    brokenBlockTypeId: EventRoutePrefix.BrokenBlockTypeId,
    itemTypeId: EventRoutePrefix.ItemTypeId,
    beforeItemTypeId: EventRoutePrefix.BeforeItemTypeId,
    entityTypeId: EventRoutePrefix.EntityTypeId,
    damagerTypeId: EventRoutePrefix.DamagerTypeId,
    eventId: EventRoutePrefix.EventId,
    effectTypeId: EventRoutePrefix.EffectTypeId,
    fromDimensionId: EventRoutePrefix.FromDimensionId,
    toDimensionId: EventRoutePrefix.ToDimensionId,
    projectileTypeId: EventRoutePrefix.ProjectileTypeId,
    toSlot: EventRoutePrefix.NextHotbarSlot,
    fromSlot: EventRoutePrefix.PreviousHotbarSlot,
    equipmentSlot: EventRoutePrefix.EquipmentSlot,
  };

  const parts: string[] = [];

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const prefix = EVENT_ROUTE_PREFIXES[key];
    const value = options[key];
    if (prefix !== undefined && value !== undefined) {
      parts.push(`${prefix}@${value}`);
    }
  }

  return parts.length > 0 ? parts.sort().join('-') : EVENT_ROUTE_GLOBAL_ID;
};

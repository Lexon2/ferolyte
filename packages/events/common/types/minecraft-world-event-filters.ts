import {
  BlockEventOptions,
  EntityDataDrivenTriggerEventOptions,
  EntityEventOptions,
  HotbarEventOptions,
  InventoryItemEventOptions,
} from '@minecraft/server';

export type MinecraftWorldEventFilters =
  | BlockEventOptions
  | EntityDataDrivenTriggerEventOptions
  | EntityEventOptions
  | HotbarEventOptions
  | InventoryItemEventOptions;

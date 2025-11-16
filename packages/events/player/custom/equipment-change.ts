import {
  ContainerSlot,
  EntityComponentTypes,
  EquipmentSlot,
  ItemStack,
  Player,
  system,
} from '@minecraft/server';

import { RequireAtLeastOne } from '@artifex/common/types';
import {
  EventItemTypeIdsRouteOption,
  EventRouteController,
  EventRoutePrefix,
  MinecraftEventSignal,
} from '@artifex/events/common';
import { BasicEventListener } from '@artifex/events/common/basic-event.listener';
import { BasicEventRouter } from '@artifex/events/common/basic-event.router';
import { EventAction, EventActionData } from '@artifex/events/common/types';
import { ArtifexEventUtils } from '@artifex/events/common/utils';
import { PlayerEquipment } from 'packages/server/player/equipment';
import { OnlinePlayers } from 'packages/server/player/online-players';

/// Private Types ///
interface PlayerEquipmentChangeEvent {
  player: Player;
  slot: EquipmentSlot;
  itemStack?: ItemStack;
}

type Action = EventAction<PlayerEquipmentChangeEvent>;

type PlayerEquipmentChangeEventOptions = RequireAtLeastOne<
  {
    equipmentSlot: EquipmentSlot[];
  } & EventItemTypeIdsRouteOption
>;

/// Private API ///

let router: BasicEventRouter<Action, EventActionData<Action>> | undefined;
let listener: BasicEventListener<PlayerEquipmentChangeEvent> | undefined;

/// Custom Event Signal ///

let EVENT_SIGNAL_REF: number | undefined;
const CALLBACKS = new Set<Action>();

type PlayerEquipmentChangeEventCache = {
  [key in EquipmentSlot]: {
    itemStack: ItemStack | undefined;
    slot: ContainerSlot;
  };
};
const PLAYERS_EQUIPMENT_CACHE: Record<string, PlayerEquipmentChangeEventCache> =
  {};

function createCache(player: Player): PlayerEquipmentChangeEventCache {
  const equipment = PlayerEquipment.get(player);

  // @TODO: Improve performance caching only necessary slots
  const equipmentSlots = Object.values(EquipmentSlot);
  const cache: PlayerEquipmentChangeEventCache =
    {} as PlayerEquipmentChangeEventCache;
  for (const slot of equipmentSlots) {
    cache[slot] = {
      itemStack: equipment.getEquipment(slot),
      slot: equipment.getEquipmentSlot(slot),
    };
  }

  return cache;
}

function tick(includeSlots: EquipmentSlot[] = Object.values(EquipmentSlot)) {
  for (const player of OnlinePlayers.getAll()) {
    const { name } = player;

    const cache = (PLAYERS_EQUIPMENT_CACHE[name] ??= createCache(player));
    for (const slotName of includeSlots) {
      const { slot, itemStack: oldItemStack } = cache[slotName];

      if ((slot.hasItem() ? slot.typeId : undefined) !== oldItemStack?.typeId) {
        if (!player.getComponent(EntityComponentTypes.Health)?.currentValue) {
          console.warn('Player is dead', name);
          continue;
        }
        const itemStack = slot.getItem();
        CALLBACKS.forEach((callback) => {
          callback({ player, slot: slotName, itemStack });
        });
        cache[slotName].itemStack = itemStack;
      }
    }
  }
}

class PlayerEquipmentChangeEventSignal
  implements MinecraftEventSignal<PlayerEquipmentChangeEvent>
{
  constructor() {}

  private start(): void {
    if (EVENT_SIGNAL_REF === undefined) {
      EVENT_SIGNAL_REF = system.runInterval(tick, 2);
    }
  }

  private stop(): void {
    if (EVENT_SIGNAL_REF !== undefined) {
      system.clearRun(EVENT_SIGNAL_REF);
    }
  }

  public subscribe(callback: Action): Action {
    CALLBACKS.add(callback);

    this.start();

    return callback;
  }

  public unsubscribe(callback: Action): void {
    CALLBACKS.delete(callback);

    if (CALLBACKS.size === 0) {
      this.stop();
    }
  }
}

/// Public API ///

export function playerEquipmentChange(
  action: Action,
  options?: PlayerEquipmentChangeEventOptions,
): EventRouteController {
  router ??= new BasicEventRouter<Action, EventActionData<Action>>();

  listener ??= new BasicEventListener({
    signal: new PlayerEquipmentChangeEventSignal(),
    callback(event) {
      const combos = router!.getByEventParams(
        `${EventRoutePrefix.EquipmentSlot}@${event.slot}`,
        `${EventRoutePrefix.ItemTypeId}@${event.itemStack?.typeId ?? 'empty'}`,
      );
      for (let i = 0; i < combos.length; i++) {
        combos[i].action(event);
      }
    },
  });

  return ArtifexEventUtils.initializeEvent<
    PlayerEquipmentChangeEvent,
    PlayerEquipmentChangeEventOptions
  >(listener, router, action, options);
}

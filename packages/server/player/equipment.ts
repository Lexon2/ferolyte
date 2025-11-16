import {
  EntityComponentTypes,
  EntityEquippableComponent,
  Player,
} from '@minecraft/server';

import { OnlinePlayers } from './online-players';

const EQUIPMENT_CACHE: Record<string, EntityEquippableComponent> = {};

function cacheEquippable(player: Player) {
  const { name } = player;
  if (!EQUIPMENT_CACHE[name]) {
    const equipment = player.getComponent(EntityComponentTypes.Equippable);
    if (equipment) {
      EQUIPMENT_CACHE[name] = equipment;
    }
  }
}

OnlinePlayers.onJoin((player) => {
  cacheEquippable(player);
});

OnlinePlayers.onLeave(({ name }) => {
  delete EQUIPMENT_CACHE[name];
});

export class PlayerEquipment {
  public static get(player: Player): EntityEquippableComponent {
    const { name } = player;
    if (!EQUIPMENT_CACHE[name]) {
      cacheEquippable(player);
    }

    return EQUIPMENT_CACHE[name]!;
  }
}

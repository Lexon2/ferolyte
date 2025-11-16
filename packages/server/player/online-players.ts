import { Player, world } from '@minecraft/server';

import { playerJoin } from '@artifex/events/player/after/join';
import { playerLeave } from '@artifex/events/player/before/leave';
import { worldLoad } from '@artifex/events/world/after/world-load';

type OnlinePlayerEventCallback = (player: Player) => void;

const ONLINE_PLAYERS: Set<Player> = new Set();
const SUBSCRIBED_JOIN_CALLBACKS: Set<OnlinePlayerEventCallback> = new Set();
const SUBSCRIBED_LEAVE_CALLBACKS: Set<OnlinePlayerEventCallback> = new Set();

worldLoad(() => {
  for (const player of world.getAllPlayers()) {
    ONLINE_PLAYERS.add(player);
    SUBSCRIBED_JOIN_CALLBACKS.forEach((callback) => callback(player));
  }
});

playerJoin(({ playerName: name }) => {
  const player = world.getPlayers({ name })[0];
  if (player !== undefined) {
    ONLINE_PLAYERS.add(player);
    SUBSCRIBED_JOIN_CALLBACKS.forEach((callback) => callback(player));
  }
});

playerLeave(({ player }) => {
  try {
    const { name } = player;
    const cachedPlayer = [...ONLINE_PLAYERS].find((p) => p.name === name);
    if (cachedPlayer !== undefined) {
      ONLINE_PLAYERS.delete(cachedPlayer);
      SUBSCRIBED_LEAVE_CALLBACKS.forEach((callback) => callback(cachedPlayer));
    }
  } catch {}
});

export class OnlinePlayers {
  public static getAll(): Player[] {
    return Array.from(ONLINE_PLAYERS);
  }

  public static get(name: string): Player | undefined {
    return [...ONLINE_PLAYERS].find((p) => p.name === name);
  }

  public static onJoin(
    callback: OnlinePlayerEventCallback,
  ): OnlinePlayerEventCallback {
    SUBSCRIBED_JOIN_CALLBACKS.add(callback);

    return callback;
  }

  public static onJoinUnsubscribe(callback: OnlinePlayerEventCallback): void {
    SUBSCRIBED_JOIN_CALLBACKS.delete(callback);
  }

  public static onLeave(
    callback: OnlinePlayerEventCallback,
  ): OnlinePlayerEventCallback {
    SUBSCRIBED_LEAVE_CALLBACKS.add(callback);

    return callback;
  }

  public static onLeaveUnsubscribe(callback: OnlinePlayerEventCallback): void {
    SUBSCRIBED_LEAVE_CALLBACKS.delete(callback);
  }
}

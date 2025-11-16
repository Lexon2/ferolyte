import * as PlayerAfterEvents from '@artifex/events/player/after';

PlayerAfterEvents.playerSpawn(({ player, initialSpawn }) => {
  console.warn(
    `Player ${player.name} has spawned. Initial spawn: ${initialSpawn}`,
  );
});

import * as PlayerAfterEvents from '@artifex/events/player/after';

PlayerAfterEvents.gameModeChange(({ player, fromGameMode, toGameMode }) => {
  console.warn(
    `Player ${player.name} changed game mode from ${fromGameMode} to ${toGameMode}`,
  );
});

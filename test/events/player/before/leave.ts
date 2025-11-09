import * as PlayerBeforeEvents from '@artifex/events/player/before';

PlayerBeforeEvents.leave(({ player }) => {
  console.warn(`Player ${player.name} is about to leave the game.`);
});

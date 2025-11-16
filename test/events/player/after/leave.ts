import * as PlayerAfterEvents from '@artifex/events/player/after';

PlayerAfterEvents.leave(({ playerName }) => {
  console.warn(`Player ${playerName} has left the game.`);
});

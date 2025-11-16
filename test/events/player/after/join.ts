import * as PlayerAfterEvents from '@artifex/events/player/after';

PlayerAfterEvents.join(({ playerName }) => {
  console.warn(`Player ${playerName} has joined the game.`);
});

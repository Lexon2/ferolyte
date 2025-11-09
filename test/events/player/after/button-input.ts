import * as PlayerAfterEvents from '@artifex/events/player/after';

PlayerAfterEvents.buttonInput(({ button, newButtonState, player }) => {
  console.warn(
    `Player ${player.name} pressed button ${button} with state ${newButtonState}`,
  );
});

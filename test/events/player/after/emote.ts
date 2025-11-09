import * as PlayerAfterEvents from '@artifex/events/player/after';

PlayerAfterEvents.emote(({ player, personaPieceId }) => {
  console.warn(
    `Player ${player.name} performed emote with ID ${personaPieceId}`,
  );
});

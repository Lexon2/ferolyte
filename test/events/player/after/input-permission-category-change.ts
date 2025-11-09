import * as PlayerAfterEvents from '@artifex/events/player/after';

PlayerAfterEvents.inputPermissionCategoryChange(
  ({ player, category, enabled }) => {
    console.warn(
      `Player ${player.name} had input permission category ${category} changed to ${enabled}`,
    );
  },
);

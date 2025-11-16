import * as WorldAfterEvents from '@artifex/events/world/after';

WorldAfterEvents.buttonPush(
  ({ block }) => {
    console.warn(`Button ${block.typeId} was pushed.`);
  },
  {
    blockTypeId: ['minecraft:stone_button'],
  },
);

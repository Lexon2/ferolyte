import { describe, it } from 'vitest';
import { createDestructibleByMining } from '@ferolyte/pack/content/block/components/destructible-by-mining';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createDestructibleByMining', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createDestructibleByMining);
  });

  it('maps boolean value', () => {
    expectComponent(
      createDestructibleByMining,
      true,
      'minecraft:destructible_by_mining',
      true,
    );
  });

  it('returns undefined for negative secondsToDestroy', () => {
    expectUndefined(createDestructibleByMining, { secondsToDestroy: -1 });
  });

  it('maps mining fields', () => {
    expectComponent(
      createDestructibleByMining,
      {
        secondsToDestroy: 2,
        itemSpecificSpeeds: [
          { item: 'minecraft:iron_pickaxe', destroySpeed: 5 },
        ],
      },
      'minecraft:destructible_by_mining',
      {
        seconds_to_destroy: 2,
        item_specific_speeds: [
          { item: 'minecraft:iron_pickaxe', destroy_speed: 5 },
        ],
      },
    );
  });
});

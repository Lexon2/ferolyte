import { describe, it } from 'vitest';
import { createDurabilitySensor } from '@artifex/pack/content/item/convertors/components/durability-sensor';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createDurabilitySensor', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createDurabilitySensor);
  });

  it('returns undefined for negative durability', () => {
    expectUndefined(createDurabilitySensor, { durability: -1 });
  });

  it('maps all fields', () => {
    expectComponent(createDurabilitySensor, {
      durability: 10,
      particleType: 'minecraft:crit',
      soundEvent: 'random.break',
    }, 'minecraft:durability_sensor', {
      durability: 10,
      particle_type: 'minecraft:crit',
      sound_event: 'random.break',
    });
  });
});

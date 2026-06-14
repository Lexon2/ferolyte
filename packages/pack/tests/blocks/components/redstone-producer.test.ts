import { describe, it } from 'vitest';
import { createRedstoneProducer } from '@artifex/pack/content/block/components/redstone-producer';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createRedstoneProducer', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createRedstoneProducer);
  });

  it('returns undefined for invalid face', () => {
    expectUndefined(createRedstoneProducer, { power: 15, connectedFaces: ['invalid'] });
  });

  it('maps redstone producer fields', () => {
    expectComponent(createRedstoneProducer, {
      power: 15,
      stronglyPoweredFace: ['up'],
      connectedFaces: ['north', 'south'],
      transformRelative: true,
    }, 'minecraft:redstone_producer', {
      power: 15,
      strongly_powered_face: ['up'],
      connected_faces: ['north', 'south'],
      transform_relative: true,
    });
  });
});

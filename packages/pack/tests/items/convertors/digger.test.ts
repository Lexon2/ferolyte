import { describe, expect, it } from 'vitest';
import { createDigger } from '@artifex/pack/content/item/convertors/components/digger';
import { expectUndefined } from '../helpers/assert-component';

describe('createDigger', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createDigger);
  });

  it('returns undefined for empty destroySpeeds', () => {
    expectUndefined(createDigger, { destroySpeeds: [] });
  });

  it('maps destroy speeds and useEfficiency', () => {
    expect(createDigger({
      useEfficiency: true,
      destroySpeeds: [{ block: 'test:stone', speed: 5 }],
    })).toEqual({
      'minecraft:digger': {
        use_efficiency: true,
        destroy_speeds: [{ block: 'test:stone', speed: 5 }],
      },
    });
  });

  it('still returns output with invalid nested values', () => {
    expect(createDigger({
      destroySpeeds: [{ block: '', speed: -1 }],
    })).toBeDefined();
  });
});

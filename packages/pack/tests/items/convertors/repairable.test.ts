import { describe, expect, it } from 'vitest';
import { createRepairable } from '@artifex/pack/content/item/convertors/components/repairable';
import { expectComponent } from '../helpers/assert-component';

describe('createRepairable', () => {
  it('returns undefined when input is missing', () => {
    expect(createRepairable()).toBeUndefined();
  });

  it('returns empty repairable for empty options', () => {
    expectComponent(createRepairable, {}, 'minecraft:repairable', {});
  });

  it('maps repair items', () => {
    expect(createRepairable({
      repairItems: [{ items: ['minecraft:iron_ingot'], repairAmount: 25 }],
    })).toEqual({
      'minecraft:repairable': {
        repair_items: [{ items: ['minecraft:iron_ingot'], repair_amount: 25 }],
      },
    });
  });

  it('still returns output with invalid nested values', () => {
    expect(createRepairable({
      repairItems: [{ items: [], repairAmount: -1 }],
    })).toBeDefined();
  });
});

import { describe, it } from 'vitest';
import { createFlammable } from '@artifex/pack/content/block/components/flammable';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createFlammable', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createFlammable);
  });

  it('maps boolean value', () => {
    expectComponent(createFlammable, true, 'minecraft:flammable', true);
  });

  it('returns undefined for invalid modifier type', () => {
    expectUndefined(createFlammable, { catchChanceModifier: 'high' });
  });

  it('maps flammable modifiers', () => {
    expectComponent(createFlammable, {
      catchChanceModifier: 5,
      destroyChanceModifier: 20,
    }, 'minecraft:flammable', {
      catch_chance_modifier: 5,
      destroy_chance_modifier: 20,
    });
  });
});

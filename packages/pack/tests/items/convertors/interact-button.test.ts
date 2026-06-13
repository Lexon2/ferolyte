import { describe, it } from 'vitest';
import { createInteractButton } from '@artifex/pack/content/item/convertors/components/interact-button';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createInteractButton', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createInteractButton);
  });

  it('returns undefined for invalid type', () => {
    expectUndefined(createInteractButton, 123);
  });

  it('maps boolean value', () => {
    expectComponent(createInteractButton, true, 'minecraft:interact_button', true);
  });

  it('maps string value', () => {
    expectComponent(createInteractButton, 'Use', 'minecraft:interact_button', 'Use');
  });
});

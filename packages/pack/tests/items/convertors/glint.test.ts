import { describe, expect, it } from 'vitest';
import { createGlint } from '@ferolyte/pack/content/item/convertors/components/glint';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createGlint', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createGlint);
  });

  it('returns undefined for invalid type', () => {
    expectUndefined(createGlint, 'invalid');
  });

  it('maps valid boolean to minecraft:glint', () => {
    expectComponent(createGlint, true, 'minecraft:glint', true);
    expectComponent(createGlint, false, 'minecraft:glint', false);
  });
});

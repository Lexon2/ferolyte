import { describe, it } from 'vitest';
import { createTags } from '@ferolyte/pack/content/item/convertors/components/tags';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createTags', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createTags);
  });

  it('returns undefined for empty string tag', () => {
    expectUndefined(createTags, ['']);
  });

  it('accepts custom tags', () => {
    expectComponent(createTags, ['custom:my_tag'], 'minecraft:tags', {
      tags: ['custom:my_tag'],
    });
  });

  it('maps valid tags', () => {
    expectComponent(createTags, ['minecraft:is_food'], 'minecraft:tags', {
      tags: ['minecraft:is_food'],
    });
  });
});

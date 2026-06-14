import { describe, it } from 'vitest';
import { createBlockTags } from '@artifex/pack/content/block/components/tags';
import { expectMultiKey, expectUndefined } from '../helpers/assert-component';

describe('createBlockTags', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createBlockTags);
  });

  it('returns undefined for empty tag string', () => {
    expectUndefined(createBlockTags, ['']);
  });

  it('maps tags to tag-prefixed keys', () => {
    expectMultiKey(createBlockTags, ['stone_tier_destructible', 'custom_tag'], {
      'tag:stone_tier_destructible': {},
      'tag:custom_tag': {},
    });
  });
});

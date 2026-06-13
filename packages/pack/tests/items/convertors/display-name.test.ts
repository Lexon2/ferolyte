import { describe, it } from 'vitest';
import { createDisplayName } from '@artifex/pack/content/item/convertors/components/display-name';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createDisplayName', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createDisplayName);
  });

  it('returns undefined for empty string', () => {
    expectUndefined(createDisplayName, '');
  });

  it('maps valid display name', () => {
    expectComponent(createDisplayName, 'Stone', 'minecraft:display_name', { value: 'Stone' });
  });
});

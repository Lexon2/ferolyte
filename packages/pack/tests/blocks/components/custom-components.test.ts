import { describe, it } from 'vitest';
import { createCustomComponents } from '@ferolyte/pack/content/block/components/custom-components';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createCustomComponents', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createCustomComponents);
  });

  it('returns undefined for invalid entry', () => {
    expectUndefined(createCustomComponents, ['']);
  });

  it('maps custom components', () => {
    expectComponent(
      createCustomComponents,
      ['test:custom'],
      'minecraft:custom_components',
      ['test:custom'],
    );
  });
});

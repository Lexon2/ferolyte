import { describe, it } from 'vitest';
import { createConnectionRule } from '@artifex/pack/content/block/components/connection-rule';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createConnectionRule', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createConnectionRule);
  });

  it('returns undefined for invalid acceptsConnectionsFrom', () => {
    expectUndefined(createConnectionRule, { acceptsConnectionsFrom: 'invalid' });
  });

  it('maps connection rule fields', () => {
    expectComponent(createConnectionRule, {
      acceptsConnectionsFrom: 'only_fences',
      enabledDirections: ['north', 'south'],
    }, 'minecraft:connection_rule', {
      accepts_connections_from: 'only_fences',
      enabled_directions: ['north', 'south'],
    });
  });
});

import { describe, expect, expectTypeOf, it } from 'vitest';

import { BlockConfig } from '../../content/block/interfaces/block-config';
import { ClientEntityConfig } from '../../content/client-entity/interfaces/client-entity-config';
import { ItemConfig } from '../../content/item/interfaces/item-config';
import { ServerEntityConfig } from '../../content/server-entity/interfaces/server-entity-config';

describe('open version strings', () => {
  it('accepts unknown version strings for all content configs', () => {
    expectTypeOf<{ version: '1.26.40' }>().toMatchTypeOf<ItemConfig>();
    expectTypeOf<{ version: '1.99.0' }>().toMatchTypeOf<BlockConfig>();
    expectTypeOf<{ version: '1.99.0' }>().toMatchTypeOf<ClientEntityConfig>();
    expectTypeOf<{ version: '1.99.0' }>().toMatchTypeOf<ServerEntityConfig>();
    expect(true).toBe(true);
  });

  it('keeps legacy detection for known legacy literals only', () => {
    type Legacy = ItemConfig<'1.21.70'>['components'];
    type Modern = ItemConfig<'1.26.40'>['components'];
    expectTypeOf<Legacy>().not.toEqualTypeOf<Modern>();
  });
});

import { describe, expect, it } from 'vitest';

import { ClientEntityBuilder } from '@ferolyte/pack/content/client-entity/client-entity-builder';
import { Molang } from '@ferolyte/pack/content/molang/molang';

describe('ClientEntityBuilder', () => {
  it('converts scripts with Molang animate, initialize, and preAnimation', () => {
    const entity = new ClientEntityBuilder({
      identifier: 'test:entity',
      animations: {
        walk: 'animation.test.walk',
        run: 'animation.test.run',
      },
      scripts: {
        animate: [
          'walk',
          { run: new Molang().query('is_sprinting') },
        ],
        initialize: [
          'variable.test = 1;',
          new Molang().assignVariable('scale', 2),
        ],
        preAnimation: [new Molang().raw('variable.x = 0')],
      },
    }).build();

    expect(entity['minecraft:client_entity'].description.scripts).toEqual({
      animate: ['walk', { run: 'query.is_sprinting' }],
      initialize: ['variable.test = 1;', 'variable.scale = 2;'],
      pre_animation: ['variable.x = 0;'],
    });
  });
});

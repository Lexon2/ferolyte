import { describe, it } from 'vitest';

import { convertDashActionComponent } from '@ferolyte/pack/content/server-entity/convertors/components/control/dash-action-component.convertor';

import {
  expectComponent,
  expectUndefined,
} from '../../helpers/assert-component';

describe('convertDashActionComponent', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(convertDashActionComponent);
  });

  it('returns undefined for invalid direction', () => {
    expectUndefined(convertDashActionComponent, {
      direction: 'invalid',
    });
  });

  it('maps dash action fields to snake_case', () => {
    expectComponent(
      convertDashActionComponent,
      {
        canDashUnderwater: true,
        cooldownTime: 2,
        horizontalMomentum: 1.5,
        verticalMomentum: 0.5,
        direction: 'passenger',
      },
      'minecraft:dash_action',
      {
        can_dash_underwater: true,
        cooldown_time: 2,
        horizontal_momentum: 1.5,
        vertical_momentum: 0.5,
        direction: 'passenger',
      },
    );
  });
});

import { describe, it } from 'vitest';
import { createThrowable } from '@ferolyte/pack/content/item/convertors/components/throwable';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createThrowable', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createThrowable);
  });

  it('returns undefined for invalid doSwingAnimation', () => {
    expectUndefined(createThrowable, { doSwingAnimation: 'yes' });
  });

  it('maps throwable fields', () => {
    expectComponent(
      createThrowable,
      {
        doSwingAnimation: true,
        launchPowerScale: 1,
        maxDrawDuration: 20,
        minDrawDuration: 0,
        maxLaunchPower: 3,
        scalePowerByDrawDuration: true,
      },
      'minecraft:throwable',
      {
        do_swing_animation: true,
        launch_power_scale: 1,
        max_draw_duration: 20,
        min_draw_duration: 0,
        max_launch_power: 3,
        scale_power_by_draw_duration: true,
      },
    );
  });
});

import { describe, it } from 'vitest';

import { convertFollowTargetLeaderBehavior } from '@ferolyte/pack/content/server-entity/convertors/behaviors/follow-target-leader-behavior.convertor';

import {
  expectComponent,
  expectUndefined,
} from '../../helpers/assert-component';

describe('convertFollowTargetLeaderBehavior', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(convertFollowTargetLeaderBehavior);
  });

  it('returns undefined for negative priority', () => {
    expectUndefined(convertFollowTargetLeaderBehavior, { priority: -1 });
  });

  it('maps follow_target_leader behavior', () => {
    expectComponent(
      convertFollowTargetLeaderBehavior,
      {
        priority: 3,
        speedMultiplier: 1.2,
        alwaysLookForLeader: true,
        followDistance: 4,
        withinRadius: 16,
      },
      'minecraft:behavior.follow_target_leader',
      {
        priority: 3,
        speed_multiplier: 1.2,
        always_look_for_leader: true,
        follow_distance: 4,
        within_radius: 16,
      },
    );
  });
});

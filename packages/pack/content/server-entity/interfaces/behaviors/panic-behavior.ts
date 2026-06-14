

import { BehaviorPriority } from './behavior-priority';
import { DamageSourceType } from '../../constants/damage-source-types';
import { SoundEvent } from '../../constants/sound-events';

/**
 * Allows the mob to enter panic mode, which makes it run around and away from the damage source that made it enter this mode.
 */
export interface PanicBehavior extends BehaviorPriority {

  /**
   * The list of Entity Damage Sources that will cause this mob to panic
   * @default []
   */
  damageSources?: DamageSourceType[];

  /**
   * If true, this mob will not stop panicking until it can't move anymore or the goal is removed from it
   * @default false
   */
  force?: boolean;

  /**
   * If true, the mob will not panic in response to damage from other mobs. This overrides the damage types in `damage_sources`
   * @default false
   */
  ignoreMobDamage?: boolean;

  /**
   * If true, the mob will prefer water over land
   * @default false
   */
  preferWater?: boolean;

  /**
   * The sound event to play when this mob is in panic
   * @default ""
   */
  panicSound?: SoundEvent;

  /**
   * The range of time in seconds to randomly wait before playing the sound again
   * @default { rangeMin: 0, rangeMax: 0 }
   */
  soundInterval?: {
    rangeMin: number;
    rangeMax: number;
  };
}

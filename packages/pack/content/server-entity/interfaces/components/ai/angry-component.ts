import { EntityFilters } from '../../filters';
import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the angry component
 * Defines the entity's 'angry' state using a timer.
 */
export interface AngryComponent {
  /**
   * If true, other entities of the same entity definition within the broadcastRange will also become angry
   * @default false
   */
  broadcastAnger?: boolean;

  /**
   * Conditions that make this entry in the list valid
   */
  broadcastFilters?: EntityFilters;

  /**
   * Filter out mob types that it should not attack while angry (other Piglins)
   */
  filters?: EntityFilters;

  /**
   * Distance in blocks within which other entities of the same entity definition will become angry
   * @default 20
   */
  broadcastRange?: number;

  /**
   * A list of entity families to broadcast anger to
   */
  broadcastTargets?: string[];

  /**
   * Event to run after the number of seconds specified in duration expires
   */
  calmEvent?: EntityEventTrigger;

  /**
   * The sound event to play when the mob is angry
   */
  angrySound?: string;

  /**
   * If true, other entities of the same entity definition within the broadcastRange will also become angry whenever this mob attacks
   * @default false
   */
  broadcastAngerOnAttack?: boolean;

  /**
   * If true, other entities of the same entity definition within the broadcastRange will also become angry whenever this mob is attacked
   * @default false
   */
  broadcastAngerOnBeingAttacked?: boolean;

  /**
   * If false, when this mob is killed it does not spread its anger to other entities of the same entity definition within the broadcastRange
   * @default true
   */
  broadcastAngerWhenDying?: boolean;

  /**
   * The amount of time in seconds that the entity will be angry
   * @default 25
   */
  duration?: number;

  /**
   * Variance in seconds added to the duration [-delta, delta]
   * @default 0
   */
  durationDelta?: number;

  /**
   * The range of time in seconds to randomly wait before playing the sound again
   * @default [2.0, 5.0]
   */
  soundInterval?: [number, number] | { rangeMin: number; rangeMax: number };
}

import { BehaviorPriority } from './behavior-priority';
import { SoundEvent } from '../../constants/sound-events';
import { EntityEventTrigger } from '../trigger';

/**
 * Allows an entity to be tempted by a set item.
 */
export interface TemptBehavior extends BehaviorPriority {
  /**
   * The speed multiplier for the entity when tempted.
   */
  speedMultiplier?: number;

  /**
   * If true, the mob can stop being tempted if the player moves too fast while close to this mob.
   * @default false
   */
  canGetScared?: boolean;

  /**
   * If true, the mob can be tempted even if it has a passenger (i.e. if being ridden).
   * @default false
   */
  canTemptWhileRidden?: boolean;

  /**
   * If true, vertical distance to the player will be considered when tempting.
   * @default false
   */
  canTemptVertically?: boolean;

  /**
   * List of items this mob is tempted by.
   */
  items?: string[];

  /**
   * Range of random ticks to wait between tempt sounds.
   */
  soundInterval?: number | [number, number];

  /**
   * The distance at which the mob will stop following the player.
   * @default 1.5
   */
  stopDistance?: number;

  /**
   * Sound to play while the mob is being tempted.
   */
  temptSound?: SoundEvent;

  /**
   * Distance in blocks this mob can get tempted by a player holding an item they like.
   * @default 0
   */
  withinRadius?: number;

  /**
   * Specifies the event to trigger when the goal starts.
   */
  onStart?: EntityEventTrigger;

  /**
   * Specifies the event to trigger when the goal ends.
   */
  onEnd?: EntityEventTrigger;
}

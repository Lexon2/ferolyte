import { BehaviorPriority } from './behavior-priority';
import { SoundEvent } from '../../constants/sound-events';
import { EntityFilters } from '../filters';

/**
 * Allows the mob to send an event to another mob.
 */
export interface SendEventBehavior extends BehaviorPriority {
  /**
   * Time in seconds for the entire event sending process
   */
  castDuration?: number;

  /**
   * If true, the mob will face the entity it sends an event to
   * @default true
   */
  lookAtTarget?: boolean;

  /**
   * List of spells for the mob to use
   */
  eventChoices?: EventChoice[];

  /**
   * List of steps for the spell
   */
  sequence?: EventStep[];
}

/**
 * A spell that the mob can cast.
 */
export interface EventChoice {
  /**
   * The minimum distance in blocks the target must be for this spell to be cast
   */
  minActivationRange?: number;

  /**
   * The maximum distance in blocks the target must be for this spell to be cast
   */
  maxActivationRange?: number;

  /**
   * Time in seconds before the mob can use this spell again
   */
  cooldownTime?: number;

  /**
   * Time in seconds the spell casting will take
   */
  castDuration?: number;

  /**
   * The filters to apply to the spell
   */
  filters?: EntityFilters;

  /**
   * The color of the particles for this spell
   */
  particleColor?: string;

  /**
   * The weight of this spell. Controls how likely this spell will be picked
   */
  weight?: number;

  /**
   * The sound event to play when using this spell
   */
  startSoundEvent?: string;

  /**
   * List of steps for the spell
   */
  sequence?: EventStep[];
}

/**
 * A step in a spell.
 */
export interface EventStep {
  /**
     * Amount of time in seconds before starting this step
     * @default 0
     */
  baseDelay?: number;

  /**
   * The event to send to the entity
   * @default ""
   */
  event?: string;

  /**
   * The sound event to play when this step happens
   * @default ""
   */
  soundEvent?: SoundEvent;
}

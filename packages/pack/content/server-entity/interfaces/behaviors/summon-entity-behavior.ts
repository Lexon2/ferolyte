import { BehaviorPriority } from './behavior-priority';
import { EntityEventTarget } from '../../constants/event-target';
import { SoundEvent } from '../../constants/sound-events';
import { EntityFilters } from '../filters';

/**
 * List of steps for the spell.
 */
export interface SummonSequence {
  /**
   * Amount of time in seconds to wait before this step starts
   * @default 0
   */
  delay?: number;

  /**
   * Amount of time in seconds before each entity is summoned in this step
   * @default 0
   */
  delayPerSummon?: number;

  /**
   * Amount of time in seconds that the spawned entity will be alive for. A value of -1.0 means it will remain alive for as long as it can
   * @default -1
   */
  entityLifespan?: number;

  /**
   * Amount of time in seconds to wait before this step starts
   * @default 0
   */
  baseDelay?: number;

  /**
   * The entity type of the entities we will spawn in this step
   */
  entityType?: string;

  /**
   * Number of entities that will be spawned in this step
   * @default 1
   */
  numEntitiesSpawned?: number;

  /**
   * The base shape of this step
   * @default 'line'
   */
  shape?: 'line' | 'circle';

  /**
   * The base size of the entity
   * @default 1
   */
  size?: number;

  /**
   * The sound event to play for this step
   */
  soundEvent?: SoundEvent;

  /**
   * Maximum number of summoned entities at any given time
   * @default 0
   */
  summonCap?: number;

  /**
   * Maximum radius where the summon entities can spawn
   * @default 0
   */
  summonCapRadius?: number;

  /**
   * Event to invoke on each summoned entity on spawn
   * @default 'self'
   */
  summonEvent?: string;

  /**
   * The target of the spell. This is where the spell will start (line will start here, circle will be centered here)
   * @default 'self'
   */
  target?: EntityEventTarget;
}

/**
 * List of spells for the mob to use to summon entities.
 */
export interface SummonChoice {
  /**
   * Time in seconds the spell casting will take
   */
  castDuration?: number;

  /**
   * Time in seconds the mob has to wait before using the spell again
   * @default 0
   */
  cooldownTime?: number;

  /**
   * If true, the mob will do the casting animations and render spell particles
   * @default true
   */
  doCasting?: boolean;

  /**
   * Conditions that need to be met for the behavior to start
   */
  filters?: EntityFilters;

  /**
   * Upper bound of the activation distance in blocks for this spell
   * @default -1
   */
  maxActivationRange?: number;

  /**
   * Lower bound of the activation distance in blocks for this spell
   * @default 1
   */
  minActivationRange?: number;

  /**
   * The color of the particles for this spell
   * @default 0
   */
  particleColor?: number | string;

  /**
   * List of steps for the spell
   */
  sequence?: SummonSequence[];

  /**
   * The sound event to play when using this spell
   */
  startSoundEvent?: SoundEvent;

  /**
   * The weight of this spell. Controls how likely the mob is to choose this spell when casting one
   * @default 0
   */
  weight?: number;
}

/**
 * Allows the mob to attack the player by summoning other entities.
 */
export interface SummonEntityBehavior extends BehaviorPriority {
  /**
   * List of spells for the mob to use to summon entities
   */
  summonChoices?: SummonChoice[];
}

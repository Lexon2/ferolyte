import { BehaviorPriority } from './behavior-priority';
import { SoundEvent } from '../../constants/sound-events';
import { TargetSelectionMethod } from '../../constants/target-selection-method';
import { EntityEventTrigger } from '../trigger';

/**
 * Allows this entity to avoid certain blocks
 */
export interface AvoidBlockBehavior extends BehaviorPriority {
  /**
   * Should start tick interval
   * @default 1
   */
  tickInterval?: number;

  /**
   * Maximum distance to look for a block in xz
   * @default 0
   */
  searchRange?: number;

  /**
   * Maximum distance to look for a block in y
   * @default 0
   */
  searchHeight?: number;

  /**
   * Modifier for sprint speed. 1.0 means keep the regular speed, while higher numbers make the sprint speed faster
   * @default 1.0
   */
  sprintSpeedModifier?: number;

  /**
   * Block search method
   * @default 'nearest'
   */
  targetSelectionMethod?: TargetSelectionMethod;

  /**
   * List of block types this mob avoids
   */
  targetBlocks?: string[];

  /**
   * The sound event to play when the mob is avoiding a block
   */
  avoidBlockSound?: SoundEvent;

  /**
   * Modifier for walking speed. 1.0 means keep the regular speed, while higher numbers make the walking speed faster
   * @default 1.0
   */
  walkSpeedModifier?: number;

  /**
   * Escape trigger
   */
  onEscape?: EntityEventTrigger;

  /**
   * The range of time in seconds to randomly wait before playing the sound again
   * @default [3.0, 8.0]
   */
  soundInterval?:
    | [number, number]
    | number
    | { rangeMin: number; rangeMax: number };
}

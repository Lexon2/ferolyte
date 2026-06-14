import { EntityEventTrigger } from '../trigger';
import { BehaviorPriority } from './behavior-priority';
import { SoundEvent } from '../../constants/sound-events';

/**
 * Enables the mob to admire items that have been configured as admirable
 * Must be used in combination with the admire_item component
 */
export interface AdmireItemBehavior extends BehaviorPriority {
  /**
   * The sound event to play when admiring the item.
   */
  admireItemSound?: SoundEvent;

  /**
   * The range of time in seconds to randomly wait before playing the sound again.
   */
  soundInterval?:
    | [number, number]
    | number
    | { rangeMin: number; rangeMax: number };

  /**
   * The event to run when admiring the item.
   */
  onAdmireItemStart?: EntityEventTrigger;

  /**
   * The event to run when no longer admiring the item.
   */
  onAdmireItemStop?: EntityEventTrigger;
}

import { SoundEvent } from '../../../server-entity/constants/sound-events';

/**
 * Interface for the durability sensor component
 * @description Defines triggers based on item durability
 */
export interface ItemDurabilitySensorComponent {
  /**
   * The effects are emitted when the item durability value is less than or equal to this value
   */
  durability?: number;

  /**
   * Particle effect to emit when the threshold is met
   */
  particleType?: string;

  /**
   * Sound effect to emit when the threshold is met
   */
  soundEvent?: SoundEvent;
}

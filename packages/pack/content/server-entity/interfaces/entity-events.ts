import { EntityFilters } from './filters';
import { EntityEventTarget } from '../constants/event-target';

/**
 * Interface for entity events
 */
export interface EntityEvents extends EntityEventBase {
  /**
   * Run a sequence of commands
   */
  sequence?: Array<EntityEventBase>;

  /**
   * Randomize between different options
   */
  randomize?: Array<EntityEventRandomize>;

  /**
   * Only execute the first valid event
   */
  firstValid?: Array<EntityEventBase>;

  /**
   * Emit a particle
   */
  emitParticle?: {
    particle: string;
  };

  /**
   * Reset the target of the entity
   */
  resetTarget?: boolean;

  /**
   * Execute an event on the block at its home position
   */
  executeEventOnHomeBlock?: {
    event: string;
  };
}

export interface EntityEventRandomize extends EntityEvents {
  /**
   * The weight on how likely this section is to trigger.
   */
  weight: number;
}

export interface EntityEventBase {
  /**
   * Only execute if filters match
   */
  filters?: EntityFilters;

  /**
   * Add the specified component groups to the entity
   */
  add?: {
    componentGroups: string[];
  };

  /**
   * Remove the specified component groups from the entity
   */
  remove?: {
    componentGroups: string[];
  };

  /**
   * Trigger another event
   */
  trigger?: string;

  /**
   * Run one or more commands
   */
  queueCommand?: {
    command: string[] | string;
    target?: EntityEventTarget;
  };

  /**
   * Set a property on the entity
   */
  setProperty?: {
    [key: string]: any;
  };

  /**
   * Set the home position of the entity
   */
  setHomePosition?: true;

  /**
   * Play a sound
   */
  playSound?: {
    sound: string;
  };

  /**
   * Stop movement of the entity
   */
  stopMovement?: {
    /**
     * Stop vertical movement
     */
    stopVerticalMovement?: boolean;

    /**
     * Stop horizontal movement
     */
    stopHorizontalMovement?: boolean;
  };
}

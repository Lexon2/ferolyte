import { RideableDismountMode } from '../../../convertors/validation/rideable-dismount-mode';
import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the rideable component
 * Allows an entity to be ridden by other entities
 */
export interface RideableComponent {
  /**
   * The seat that designates the driver of the entity
   */
  controllingSeat?: number;

  /**
   * If true, this entity can't be interacted with if the entity interacting with it is crouching
   */
  crouchingSkipInteract?: boolean;

  /**
   * List of entities that can ride this entity
   */
  familyTypes?: string[];

  /**
   * The text to display when the player can interact with the entity when playing with Touch-screen controls
   */
  interactText?: string;

  /**
   * The maximum width a mob can have to be a rider
   */
  passengerMaxWidth?: number;

  /**
   * If true, this entity will pull in entities that are in the correct family_types into any available seats
   */
  pullInEntities?: boolean;

  /**
   * If true, this entity will be picked when looked at by the rider
   */
  riderCanInteract?: boolean;

  /**
   * The number of entities that can ride this entity at the same time
   */
  seatCount?: number;

  /**
   * The list of positions and number of riders for each position for entities riding this entity
   */
  seats?: SeatsSpec[];

  /**
   * Defines where riders are placed when dismounting this entity:
   * - "default", riders are placed on a valid ground position around the entity, or at the center of the entity's collision box if none is found.
   * - "on_top_center", riders are placed at the center of the top of the entity's collision box.
   */
  dismountMode?: RideableDismountMode;

  /**
   * Event to execute on the owner entity when an entity starts riding it.
   */
  onRiderEnterEvent?: EntityEventTrigger;

  /**
   * Event to execute on the owner entity when an entity stops riding it.
   */
  onRiderExitEvent?: EntityEventTrigger;
}

/**
 * Interface for the seats specification
 * Defines the positions and number of riders for each position for entities riding this entity
 */
export interface SeatsSpec {
  /**
   * Defines where riders are placed when dismounting this entity
   */
  dismountMode?: string;

  /**
   * The camera radius when in third person or third person front camera
   */
  thirdPersonCameraRadius?: number;

  /**
   * Adds springiness to the camera movement when the camera moves back to its radius after being pushed closer to the player by and obstacle
   */
  cameraRelaxDistanceSmoothing?: number;

  /**
   *
   */
  lockRiderRotation?: number;

  /**
   * The maximum number of riders that can be riding this entity for this seat to be valid
   */
  maxRiderCount?: number;

  /**
   * The minimum number of riders that need to be riding this entity before this seat can be used
   */
  minRiderCount?: number;

  /**
   * The position of this seat relative to this entity's position
   */
  position?: [number, number, number];

  /**
   * The offset to rotate riders by
   */
  rotateRiderBy?: number;
}

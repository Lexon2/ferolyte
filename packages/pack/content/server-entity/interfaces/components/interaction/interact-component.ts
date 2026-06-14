import { SoundEvent } from '../../../constants/sound-events';
import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the interact component
 * Defines interactions with this entity
 */
export interface InteractComponent {
  /**
   * The interactions
   */
  interactions?: InteractComponentInteraction[];
}

/**
 * Interface for a single interaction entry in the interact component
 * Defines a single interaction with this entity
 */
export interface InteractComponentInteraction {
  /**
   * Loot table with items to add to the player's inventory upon successful interaction
   */
  addItems?: {
    /**
     * File path, relative to the Behavior Pack's path, to the loot table file
     */
    table: string;
  };

  /**
   * Time in seconds before this entity can be interacted with again
   * @default 0
   */
  cooldown?: number;

  /**
   * Allows entity to admire the item. Requires "minecraft:admire_item" and "minecraft:behavior.admire_item" to work
   * @default false
   */
  admire?: boolean;

  /**
   * Allows entity to barter with the item. Requires "minecraft:barter" to work
   * @default false
   */
  barter?: boolean;

  /**
   * Time in seconds before this entity can be interacted with after being attacked
   * @default 0
   */
  cooldownAfterBeingAttacked?: number;

  /**
   * The amount of health this entity will recover or hurt when interacting with this item. Negative values will harm the entity
   * @default 0
   */
  healthAmount?: number;

  /**
   * The amount of damage the item will take when used to interact with this entity. A value of 0 means the item won't lose durability
   * @default 0
   */
  hurtItem?: number;

  /**
   * Text to show when the player is able to interact in this way with this entity when playing with Touch-screen controls
   */
  interactText?: string;

  /**
   * Event to fire when the interaction occurs
   */
  onInteract?: EntityEventTrigger;

  /**
   * Particle effect that will be triggered at the start of the interaction
   */
  particleOnStart?: {
    /**
     * Whether or not the particle will appear closer to who performed the interaction
     */
    particleOffsetTowardsInteractor?: boolean;

    /**
     * The type of particle that will be spawned
     */
    particleType?: string;

    /**
     * Will offset the particle this amount in the y direction
     */
    particleYOffset?: number;
  };

  /**
   * List of sounds to play when the interaction occurs
   */
  playSounds?: SoundEvent;

  /**
   * List of entities to spawn when the interaction occurs
   */
  spawnEntities?: string;

  /**
   * Loot table with items to drop on the ground upon successful interaction
   */
  spawnItems?: {
    /**
     * File path, relative to the Behavior Pack's path, to the loot table file
     */
    table: string;
  };

  /**
   * If true, the player will do the "swing" animation when interacting with this entity
   * @default false
   */
  swing?: boolean;

  /**
   * The feed item used will transform to this item upon successful interaction. Format: itemName:auxValue
   */
  transformToItem?: string;

  /**
   * If true, the interaction will use an item
   * @default false
   */
  useItem?: boolean;

  /**
   * Vibration to emit when the interaction occurs. Admitted values are none (no vibration emitted), shear, entity_die, entity_act, entity_interact
   * @default "entity_interact"
   */
  vibration?:
    | 'none'
    | 'shear'
    | 'entity_die'
    | 'entity_act'
    | 'entity_interact';

  /**
   * Item to give to the player upon successful interaction
   */
  giveItem?: boolean;

  /**
   * Takes an item from the player
   */
  takeItem?: boolean;

  /**
   * The entity's equipment slot to remove and drop the item from, if any, upon successful interaction
   */
  dropItemSlot?: string;

  /**
   * Will offset the item drop position this amount in the y direction. Requires "drop_item_slot" to be specified
   * @default 0
   */
  dropItemYOffset?: number;

  /**
   * The entity's equipment slot to equip the item to, if any, upon successful interaction
   */
  equipItemSlot?: string;

  /**
   * Allows to repair one of the entity's items
   */
  repairEntityItem?: {
    /**
     * How much of the item durability should be restored upon interaction
     */
    amount: number;

    /**
     * The entity's slot containing the item to be repaired
     */
    slot: string;
  };
}

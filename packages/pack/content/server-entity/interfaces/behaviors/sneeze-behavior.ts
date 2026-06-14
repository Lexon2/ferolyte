import { BehaviorPriority } from './behavior-priority';
import { EntityTypes } from '../../types/entity-types';

/**
 * Allows the mob to stop and sneeze possibly startling nearby mobs and dropping an item.
 */
export interface SneezeBehavior extends BehaviorPriority {
  /**
   * Time in seconds the mob has to wait before using the goal again
   * @default 0
   */
  cooldownTime?: number;

  /**
   * The probability that the mob will drop an item when it sneezes
   * @default 1
   */
  dropItemChance?: number;

  /**
   * List of entity types this mob will startle (cause to jump) when it sneezes
   */
  entityTypes?: EntityTypes;

  /**
   * Loot table to select dropped items from
   * @default "loot_tables/empty.json"
   */
  lootTable?: string;

  /**
   * Sound to play when the sneeze is about to happen
   * @default ""
   */
  prepareSound?: string;

  /**
   * The time in seconds that the mob takes to prepare to sneeze (while the prepare_sound is playing)
   * @default 1
   */
  prepareTime?: number;

  /**
   * The probability of sneezing. A value of 1.00 is 100%
   * @default 0.02
   */
  probability?: number;

  /**
   * Sound to play when the sneeze occurs
   * @default ""
   */
  sound?: string;

  /**
   * Distance in blocks that mobs will be startled
   * @default 0
   */
  withinRadius?: number;
}

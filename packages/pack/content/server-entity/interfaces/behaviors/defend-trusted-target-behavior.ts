import { BehaviorPriority } from './behavior-priority';
import { EntityTypes } from '../../types/entity-types';
import { EntityEventTrigger } from '../trigger';

/**
 * Allows the mob to target another mob that hurts an entity it trusts
 */
export interface DefendTrustedTargetBehavior extends BehaviorPriority {
  /**
   * Sound to occasionally play while defending
   * @default ''
   */
  aggroSound?: string;

  /**
   * Time in seconds between attacks
   * @default 0
   */
  attackInterval?: number;

  /**
   * If true, only entities in this mob's viewing range can be selected as targets
   * @default false
   */
  mustSee?: boolean;

  /**
   * Determines the amount of time in seconds that this mob will look for a target before forgetting about it
   * and looking for a new one when the target isn't visible any more
   * @default 3
   */
  mustSeeForgetDuration?: number;

  /**
   * The event to run when this mob starts to defend the entity it trusts
   */
  onDefendStart?: EntityEventTrigger;

  /**
   * Distance in blocks that the target can be within to launch an attack
   * @default 0
   */
  withinRadius?: number;

  /**
   * List of entity types that this mob considers valid targets
   */
  entityTypes?: EntityTypes;

  /**
   * Probability that a sound will play
   * @default 0.05
   */
  soundChance?: number;
}

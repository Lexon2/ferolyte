import { BehaviorPriority } from './behavior-priority';

/**
 * Allows the enderman to drop a block they are carrying. Can only be used by Endermen.
 */
export interface EndermanLeaveBlockBehavior extends BehaviorPriority {
  // No additional properties needed as per the JSON schema
}

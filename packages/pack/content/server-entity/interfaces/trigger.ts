import { EntityFilters } from './filters';
import { EntityEventTarget } from '../constants/event-target';

export interface EntityEventTrigger {
  /**
   * The event to fire.
   * @minecraft event
   */
  event: string;
  /**
   * The target of the event.
   * Allowed values: `baby`, `block`, `damager`, `other`, `parent`, `player`, `self`, `target`.
   * @minecraft target
   */
  target: EntityEventTarget;
  /**
   * @minecraft filters
   */
  filters?: EntityFilters;
}

/** Trigger where event and target are optional (e.g. damage_sensor on_damage). */
export type PartialEntityEventTrigger = {
  /**
   * The event to run when the conditions for this trigger are met.
   * @minecraft event
   */
  event?: string;
  /**
   * The subject of this filter test.
   * Allowed values: `block`, `other`, `parent`, `player`, `self`, `target`, `damager`.
   * @default "self"
   * @minecraft target
   */
  target?: EntityEventTarget;
  /**
   * @minecraft filters
   */
  filters?: EntityFilters;
};

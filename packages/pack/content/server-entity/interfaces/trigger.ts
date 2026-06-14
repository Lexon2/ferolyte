import { EntityFilters } from './filters';
import { EntityEventTarget } from '../constants/event-target';

export interface EntityEventTrigger {
  event: string;
  target: EntityEventTarget;
  filters?: EntityFilters;
}

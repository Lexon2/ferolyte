import { EntityFilterFactory } from './entity-filter-factory';
import { EntityFilterTest } from '../constants/filter-tests';

export type FilterUnion = {
  [K in EntityFilterTest]: {
    test: K;
  } & EntityFilterFactory[K];
}[EntityFilterTest];

export type EntityFilterNode =
  | FilterUnion
  | EntityFilterNode[]
  | { allOf: EntityFilterNode[] }
  | { anyOf: EntityFilterNode[] }
  | { noneOf: EntityFilterNode[] }
  /** Legacy vanilla spellings, written as is. */
  | { AND: unknown[] }
  | { OR: unknown[] };

export type EntityFilters = EntityFilterNode;

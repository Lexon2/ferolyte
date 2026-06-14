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
  | { noneOf: EntityFilterNode[] };

export type EntityFilters = EntityFilterNode;

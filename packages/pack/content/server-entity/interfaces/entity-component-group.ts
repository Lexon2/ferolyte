import { EntityComponents } from './entity-components';

export interface EntityComponentGroup {
  name: string;
  components: EntityComponents;
  /** Raw components merged into the group as is. */
  rawComponents?: Record<`${string}:${string}`, unknown>;
}

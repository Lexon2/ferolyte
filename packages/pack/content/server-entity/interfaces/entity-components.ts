import type { GeneratedEntityBehaviors } from '../../generated/entity/behaviors';
import type { GeneratedEntityComponents } from '../../generated/entity/components';

export interface EntityBehaviorsComponents {
  /**
   * AI behaviors (`minecraft:behavior.*`).
   */
  behaviors?: Partial<GeneratedEntityBehaviors>;
}

/**
 * Entity components. Generated from the Bedrock schemas (`npm run codegen`).
 */
export interface EntityComponents
  extends GeneratedEntityComponents,
    EntityBehaviorsComponents {}

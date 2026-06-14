import { EntityFilters } from '../../filters';

/**
 * Interface for the conditional-bandwidth-optimization component
 * Defines the Conditional Spatial Update Bandwidth Optimizations of this entity.
 */
export interface ConditionalBandwidthOptimizationComponent {
  /**
   * The object containing the conditional bandwidth optimization values
   * @default []
   */
  conditionalValues?: Array<
    ConditionalBandwidthOptimizationConditionalValue & {
      /**
       * Conditions that must be met for these optimization values to be used
       * @default []
       */
      conditionalValues?: EntityFilters;
    }
  >;
  /**
   * The object containing the default bandwidth optimization values
   * @default {}
   */
  defaultValues?: ConditionalBandwidthOptimizationConditionalValue;
}

export interface ConditionalBandwidthOptimizationConditionalValue {
  /**
   * In relation to the optimization value, determines the maximum ticks spatial update packets can be not sent
   * @default 0
   */
  maxDroppedTicks?: number;
  /**
   * The maximum distance considered during bandwidth optimizations
   * @default 0
   */
  maxOptimizedDistance?: number;
  /**
   * When set to true, smaller motion packets will be sent during drop packet intervals
   * @default false
   */
  useMotionPredictionHints?: boolean;
}

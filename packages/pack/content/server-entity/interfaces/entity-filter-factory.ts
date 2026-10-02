import type { GeneratedFilters } from '../../generated/filters/filters';

/**
 * Properties of every filter test, keyed by the test name (without `test`).
 * Generated from the Bedrock filter schemas (`npm run codegen`).
 */
export type EntityFilterFactory = {
  [K in keyof Required<GeneratedFilters>]: Omit<
    Required<GeneratedFilters>[K],
    'test'
  >;
};

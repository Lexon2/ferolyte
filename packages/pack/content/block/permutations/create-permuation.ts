import {
  convertBlockComponents,
  MinecraftBlockComponents,
} from '../convert-components';
import {
  BlockPermutationCondition,
  BlockPermutationConfig,
} from '../interfaces/block-config';

interface BlockPermutation {
  condition: string;
  components: MinecraftBlockComponents;
}

export const createBlockPermutations = (
  permutations: BlockPermutationConfig[],
): BlockPermutation[] => {
  const result: BlockPermutation[] = [];

  for (const permutation of permutations) {
    const blockPermutation = createBlockPermutation(permutation);
    if (blockPermutation !== undefined) {
      result.push(blockPermutation);
    }
  }

  return result;
};

export const createBlockPermutation = (
  permutation: BlockPermutationConfig,
): BlockPermutation | undefined => {
  const { condition, components } = permutation;

  const stringCondition = parseBlockPermutationCondition(condition);
  if (stringCondition === undefined) {
    console.error('Invalid permutation condition');

    return undefined;
  }

  const convertedComponents = convertBlockComponents(components);
  if (convertedComponents === undefined) {
    console.error('Invalid components');

    return undefined;
  }

  return {
    condition: stringCondition,
    components: convertedComponents,
  };
};

export const parseBlockPermutationCondition = (
  condition: BlockPermutationCondition,
): string | undefined => {
  let result: string | undefined = '';

  const { states, query } = condition;

  if (states && typeof states === 'object') {
    for (const state in states) {
      const values = states[state];

      let stateCondition: string = '';
      for (const value of values) {
        stateCondition += `${createStateEqualCondition(state, value)} || `;
      }

      if (stateCondition) {
        // Remove the last ' || '
        stateCondition = stateCondition.slice(0, -4);
        result += `(${stateCondition}) && `;
      }
    }

    if (result) {
      result = result.slice(0, -4);
    }
  }

  if (query) {
    result += `${query}`;
  }
  return result;
};

/**
 * Creates a state equality condition for block permutations
 * @param stateName The name of the state to check
 * @param value The value to compare against
 * @returns A Molang condition string
 */
export const createStateEqualCondition = (
  stateName: string,
  value: string | number | boolean,
): string => {
  // Handle special case for boolean values
  if (typeof value === 'boolean') {
    return `${!value ? '!' : ''}query.block_state('${stateName}')`;
  }

  // Use double equals for comparison in Molang expressions
  return `query.block_state('${stateName}') == ${
    typeof value === 'string' ? `'${value}'` : value
  }`;
};

/**
 * Creates a state not equal condition for block permutations
 * @param stateName The name of the state to check
 * @param value The value to compare against
 * @returns A Molang condition string
 */
export const createStateNotEqualCondition = (
  stateName: string,
  value: string | number | boolean,
): string => {
  // Handle special case for boolean values
  if (typeof value === 'boolean') {
    return `${!value ? '' : '!'}query.block_state('${stateName}')`;
  }

  // Use != for comparison in Molang expressions
  return `query.block_state('${stateName}') != ${
    typeof value === 'string' ? `'${value}'` : value
  }`;
};

/**
 * Creates a numeric state comparison condition for block permutations
 * @param stateName The name of the state to check
 * @param operator The comparison operator to use (>, <, >=, <=)
 * @param value The numeric value to compare against
 * @returns A Molang condition string
 */
export const createStateComparisonCondition = (
  stateName: string,
  operator: '>' | '<' | '>=' | '<=',
  value: number,
): string => {
  if (typeof value !== 'number') {
    console.warn('Comparison value should be a number');
  }

  return `query.block_state('${stateName}') ${operator} ${value}`;
};

/**
 * Combines multiple conditions with AND logic
 * @param conditions Array of condition strings to combine
 * @returns A combined condition string with AND operator
 */
export const combineWithAnd = (conditions: string[]): string => {
  if (!Array.isArray(conditions) || conditions.length === 0) {
    return 'true';
  }

  // Filter out empty conditions
  const validConditions = conditions.filter((c) => c && c.length > 0);

  if (validConditions.length === 0) {
    return 'true';
  }

  if (validConditions.length === 1) {
    return validConditions[0];
  }

  // Wrap each condition in parentheses and join with &&
  return validConditions.map((c) => `(${c})`).join(' && ');
};

/**
 * Combines multiple conditions with OR logic
 * @param conditions Array of condition strings to combine
 * @returns A combined condition string with OR operator
 */
export const combineWithOr = (conditions: string[]): string => {
  if (!Array.isArray(conditions) || conditions.length === 0) {
    return 'false';
  }

  // Filter out empty conditions
  const validConditions = conditions.filter((c) => c && c.length > 0);

  if (validConditions.length === 0) {
    return 'false';
  }

  if (validConditions.length === 1) {
    return validConditions[0];
  }

  // Wrap each condition in parentheses and join with ||
  return validConditions.map((c) => `(${c})`).join(' || ');
};

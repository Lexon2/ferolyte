import {
  convertBlockComponents,
  MinecraftBlockComponents,
} from '../convert-components';
import {
  BlockPermutationCondition,
  BlockPermutationConfig,
} from '../interfaces/block-config';
import {
  ContentDiagnosticContext,
  logContentError,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { validateNumber } from '@ferolyte/common/content/validation/content-validation';

interface BlockPermutation {
  condition: string;
  components: MinecraftBlockComponents;
}

export const createBlockPermutations = (
  permutations: BlockPermutationConfig[],
  ctx?: ContentDiagnosticContext,
): BlockPermutation[] => {
  const result: BlockPermutation[] = [];

  for (let index = 0; index < permutations.length; index++) {
    const permutationContext =
      ctx !== undefined ? { ...ctx, fieldPath: `[${index}]` } : undefined;

    const blockPermutation = createBlockPermutation(
      permutations[index],
      permutationContext,
    );
    if (blockPermutation !== undefined) {
      result.push(blockPermutation);
    }
  }

  return result;
};

export const createBlockPermutation = (
  permutation: BlockPermutationConfig,
  ctx?: ContentDiagnosticContext,
): BlockPermutation | undefined => {
  const { condition, components } = permutation;

  const stringCondition = parseBlockPermutationCondition(condition, ctx);
  if (stringCondition === undefined) {
    logContentError(
      ctx !== undefined ? { ...ctx, fieldPath: 'condition' } : undefined,
      'Invalid permutation condition',
    );

    return undefined;
  }

  const componentsContext: ContentDiagnosticContext | undefined =
    ctx !== undefined
      ? {
          ...ctx,
          section: 'components',
          fieldPath:
            ctx.fieldPath !== undefined
              ? `${ctx.fieldPath}.components`
              : 'components',
        }
      : undefined;

  const convertedComponents = convertBlockComponents(
    components,
    componentsContext,
  );
  if (convertedComponents === undefined) {
    logContentError(
      ctx !== undefined ? { ...ctx, fieldPath: 'components' } : undefined,
      'Invalid components',
    );

    return undefined;
  }

  return {
    condition: stringCondition,
    components: convertedComponents,
  };
};

export const parseBlockPermutationCondition = (
  condition: BlockPermutationCondition,
  ctx?: ContentDiagnosticContext,
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
        stateCondition = stateCondition.slice(0, -4);
        result += `(${stateCondition}) && `;
      }
    }

    if (result) {
      result = result.slice(0, -4);
    }
  }

  if (!query) {
    return result;
  }

  if (typeof query === 'string') {
    result += `${query}`;
  } else {
    result += `${query.build()}`;
  }

  return result;
};

export const createStateEqualCondition = (
  stateName: string,
  value: string | number | boolean,
): string => {
  if (typeof value === 'boolean') {
    return `${!value ? '!' : ''}query.block_state('${stateName}')`;
  }

  return `query.block_state('${stateName}') == ${
    typeof value === 'string' ? `'${value}'` : value
  }`;
};

export const createStateNotEqualCondition = (
  stateName: string,
  value: string | number | boolean,
): string => {
  if (typeof value === 'boolean') {
    return `${!value ? '' : '!'}query.block_state('${stateName}')`;
  }

  return `query.block_state('${stateName}') != ${
    typeof value === 'string' ? `'${value}'` : value
  }`;
};

export const createStateComparisonCondition = (
  stateName: string,
  operator: '>' | '<' | '>=' | '<=',
  value: number,
  ctx?: ContentDiagnosticContext,
): string => {
  validateNumber(value, ctx, 'Comparison value should be a number');

  return `query.block_state('${stateName}') ${operator} ${value}`;
};

export const combineWithAnd = (conditions: string[]): string => {
  if (!Array.isArray(conditions) || conditions.length === 0) {
    return 'true';
  }

  const validConditions = conditions.filter((c) => c && c.length > 0);

  if (validConditions.length === 0) {
    return 'true';
  }

  if (validConditions.length === 1) {
    return validConditions[0];
  }

  return validConditions.map((c) => `(${c})`).join(' && ');
};

export const combineWithOr = (conditions: string[]): string => {
  if (!Array.isArray(conditions) || conditions.length === 0) {
    return 'false';
  }

  const validConditions = conditions.filter((c) => c && c.length > 0);

  if (validConditions.length === 0) {
    return 'false';
  }

  if (validConditions.length === 1) {
    return validConditions[0];
  }

  return validConditions.map((c) => `(${c})`).join(' || ');
};

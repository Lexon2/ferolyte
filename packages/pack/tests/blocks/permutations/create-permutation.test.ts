import { describe, expect, it } from 'vitest';
import {
  combineWithAnd,
  combineWithOr,
  createBlockPermutation,
  createBlockPermutations,
  createStateComparisonCondition,
  createStateEqualCondition,
  createStateNotEqualCondition,
  parseBlockPermutationCondition,
} from '@ferolyte/pack/content/block/permutations/create-permuation';

describe('condition helpers', () => {
  it('createStateEqualCondition handles strings, numbers, and booleans', () => {
    expect(createStateEqualCondition('power', 5)).toBe(
      "query.block_state('power') == 5",
    );
    expect(createStateEqualCondition('dir', 'north')).toBe(
      "query.block_state('dir') == 'north'",
    );
    expect(createStateEqualCondition('enabled', true)).toBe(
      "query.block_state('enabled')",
    );
    expect(createStateEqualCondition('enabled', false)).toBe(
      "!query.block_state('enabled')",
    );
  });

  it('createStateNotEqualCondition handles values', () => {
    expect(createStateNotEqualCondition('power', 0)).toBe(
      "query.block_state('power') != 0",
    );
    expect(createStateNotEqualCondition('enabled', false)).toBe(
      "query.block_state('enabled')",
    );
  });

  it('createStateComparisonCondition builds comparison expression', () => {
    expect(createStateComparisonCondition('power', '>=', 10)).toBe(
      "query.block_state('power') >= 10",
    );
  });

  it('combineWithAnd and combineWithOr join conditions', () => {
    expect(combineWithAnd(['a', 'b'])).toBe('(a) && (b)');
    expect(combineWithOr(['a', 'b'])).toBe('(a) || (b)');
    expect(combineWithAnd([])).toBe('true');
    expect(combineWithOr([])).toBe('false');
  });
});

describe('parseBlockPermutationCondition', () => {
  it('builds condition from states', () => {
    expect(
      parseBlockPermutationCondition({
        states: { direction: ['north', 'south'] },
      }),
    ).toBe(
      "(query.block_state('direction') == 'north' || query.block_state('direction') == 'south')",
    );
  });

  it('appends query expression', () => {
    expect(parseBlockPermutationCondition({ query: 'query.is_daytime' })).toBe(
      'query.is_daytime',
    );
  });
});

describe('createBlockPermutation', () => {
  it('returns permutation with converted components', () => {
    expect(
      createBlockPermutation({
        condition: { states: { enabled: [true] } },
        components: { replaceable: true },
      }),
    ).toEqual({
      condition: "(query.block_state('enabled'))",
      components: { 'minecraft:replaceable': {} },
    });
  });

  it('returns permutation with empty condition string when condition is empty', () => {
    expect(
      createBlockPermutation({
        condition: {},
        components: { replaceable: true },
      }),
    ).toEqual({
      condition: '',
      components: { 'minecraft:replaceable': {} },
    });
  });
});

describe('createBlockPermutations', () => {
  it('includes valid permutations and keeps empty condition entries', () => {
    expect(
      createBlockPermutations([
        {
          condition: { states: { enabled: [true] } },
          components: { replaceable: true },
        },
        {
          condition: {},
          components: { replaceable: true },
        },
      ]),
    ).toEqual([
      {
        condition: "(query.block_state('enabled'))",
        components: { 'minecraft:replaceable': {} },
      },
      {
        condition: '',
        components: { 'minecraft:replaceable': {} },
      },
    ]);
  });
});

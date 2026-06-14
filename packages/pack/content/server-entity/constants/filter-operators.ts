/**
 * Filter operator types
 */
export type FilterOperator =
  | '=='
  | '!='
  | '>'
  | '>='
  | '<'
  | '<='
  | 'equals'
  | 'not';

/**
 * Available filter operators
 */
export const FILTER_OPERATORS: FilterOperator[] = [
  '==',
  '!=',
  '>',
  '>=',
  '<',
  '<=',
  'equals',
  'not',
];

/**
 * Filter operator mapping to snake_case for Minecraft format
 */
export const FILTER_OPERATOR_MAPPING: Record<FilterOperator, string> = {
  '==': 'equals',
  '!=': 'not_equals',
  '>': 'greater_than',
  '>=': 'greater_than_or_equals',
  '<': 'less_than',
  '<=': 'less_than_or_equals',
  equals: 'equals',
  not: 'not',
};

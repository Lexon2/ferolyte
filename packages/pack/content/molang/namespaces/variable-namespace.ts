import type { Molang } from '../molang';
import type { MolangExpression } from '../molang-expression';
import { camelToSnake } from '../utils/case';

type VariablePrefix = 'variable' | 'temp' | 'context';
type VariableAlias = 'v' | 't' | 'c';

const PREFIX_BY_ALIAS: Record<VariableAlias, VariablePrefix> = {
  v: 'variable',
  t: 'temp',
  c: 'context',
};

export type MolangVariableNamespace = Record<string, Molang>;

export const createVariableNamespace = (
  prefix: VariablePrefix | VariableAlias,
  expression: MolangExpression,
  molang: Molang,
): MolangVariableNamespace => {
  const resolvedPrefix =
    prefix in PREFIX_BY_ALIAS
      ? PREFIX_BY_ALIAS[prefix as VariableAlias]
      : (prefix as VariablePrefix);
  const outputPrefix =
    prefix in PREFIX_BY_ALIAS ? (prefix as VariableAlias) : resolvedPrefix;

  return new Proxy({} as MolangVariableNamespace, {
    get(_target, prop, receiver) {
      if (typeof prop !== 'string') {
        return Reflect.get(_target, prop, receiver);
      }

      expression.append(`${outputPrefix}.${camelToSnake(prop)}`);
      return molang;
    },
  });
};

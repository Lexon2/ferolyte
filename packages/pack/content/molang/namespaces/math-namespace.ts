import {
  formatMolangValue,
  type MolangValue,
} from '../format-molang-value';
import type { Molang } from '../molang';
import type { MolangExpression } from '../molang-expression';
import {
  MOLANG_MATH_CONSTANTS,
  MOLANG_MATH_FUNCTIONS,
  type MolangMathFunctionNames,
} from '../types/math-names';
import { snakeToCamel } from '../utils/case';

const formatMathCall = (name: string, args: MolangValue[]): string => {
  if (args.length === 0) {
    return `math.${name}`;
  }

  return `math.${name}(${args.map(formatMolangValue).join(', ')})`;
};

export type MolangMathCallable = ((
  name: MolangMathFunctionNames | string,
  ...args: MolangValue[]
) => Molang) &
  Record<string, (...args: MolangValue[]) => Molang> & {
    readonly pi: Molang;
  };

export const createMathNamespace = (
  expression: MolangExpression,
  molang: Molang,
): MolangMathCallable => {
  const appendMath = (name: string, args: MolangValue[] = []): Molang => {
    expression.append(formatMathCall(name, args));
    return molang;
  };

  const callable = ((
    name: MolangMathFunctionNames | string,
    ...args: MolangValue[]
  ): Molang => appendMath(name, args)) as MolangMathCallable;

  for (const name of MOLANG_MATH_FUNCTIONS) {
    const camelName = snakeToCamel(name);
    callable[camelName] = (...args: MolangValue[]) => appendMath(name, args);
  }

  callable.randomInt = callable.randomInteger;

  for (const constant of MOLANG_MATH_CONSTANTS) {
    Object.defineProperty(callable, constant, {
      get(): Molang {
        expression.append(`math.${constant}`);
        return molang;
      },
    });
  }

  return callable;
};

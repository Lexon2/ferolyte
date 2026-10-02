import {
  MOLANG_MATH_CONSTANTS,
  MOLANG_MATH_FUNCTIONS,
  type MolangMathConstantNames,
  type MolangMathFunctionNames,
} from '../types/math-names';
import { MOLANG_QUERY_NAMES, type MolangQueryName } from '../types/query-names';
import { camelToSnake, snakeToCamel } from '../utils/case';
import {
  MolangExpr,
  MolangPrecedence,
  toMolangExpr,
  type MolangInput,
} from './expr';

type SnakeToCamel<S extends string> = S extends `${infer Head}_${infer Tail}`
  ? `${Head}${SnakeToCamel<Capitalize<Tail>>}`
  : S;

const callArgs = (args: readonly MolangInput[]): string =>
  args.map((arg) => toMolangExpr(arg).source).join(', ');

/**
 * `query.x` as a property when it takes no arguments,
 * `query.x(a, b)` as a function otherwise.
 */
export type MolangCallable = MolangExpr &
  ((...args: MolangInput[]) => MolangExpr);

const createCallable = (name: string): MolangCallable => {
  const callable = ((...args: MolangInput[]) =>
    new MolangExpr(`${name}(${callArgs(args)})`)) as MolangCallable;
  Object.setPrototypeOf(callable, MolangExpr.prototype);
  Object.defineProperty(callable, 'source', { value: name });
  Object.defineProperty(callable, 'precedence', {
    value: MolangPrecedence.Atom,
  });
  return Object.freeze(callable);
};

export type MolangQueryNamespace = {
  readonly [K in MolangQueryName as SnakeToCamel<`${K}`>]: MolangCallable;
};

export type MolangMathNamespace = {
  readonly [K in MolangMathFunctionNames as SnakeToCamel<K>]: (
    ...args: MolangInput[]
  ) => MolangExpr;
} & { readonly [K in MolangMathConstantNames]: MolangExpr } & {
  /** Alias of `randomInteger`. */
  readonly randomInt: (...args: MolangInput[]) => MolangExpr;
};

/** `query.*`, e.g. `q.isBaby`, `q.isItemEquipped('main_hand')`. */
export const q = Object.freeze(
  Object.fromEntries(
    MOLANG_QUERY_NAMES.map((name) => [
      snakeToCamel(name),
      createCallable(`query.${name}`),
    ]),
  ),
) as unknown as MolangQueryNamespace;

const mathFunctions = Object.fromEntries(
  MOLANG_MATH_FUNCTIONS.map((name) => [
    snakeToCamel(name),
    (...args: MolangInput[]) =>
      new MolangExpr(`math.${name}(${callArgs(args)})`),
  ]),
);

const mathConstants = Object.fromEntries(
  MOLANG_MATH_CONSTANTS.map((name) => [name, new MolangExpr(`math.${name}`)]),
);

/** `math.*`, e.g. `math.clamp(v('x'), 0, 1)`, `math.pi`. */
export const math = Object.freeze({
  ...mathFunctions,
  ...mathConstants,
  randomInt: mathFunctions.randomInteger,
}) as unknown as MolangMathNamespace;

const variable =
  (prefix: string) =>
  (name: string): MolangExpr =>
    new MolangExpr(`${prefix}.${name}`);

/** `variable.name`; the name is used exactly as written. */
export const v = variable('variable');
/** `temp.name` */
export const t = variable('temp');
/** `context.name` */
export const c = variable('context');

/** Query by name, for queries that are missing from {@link q}. */
export const query = (name: string, ...args: MolangInput[]): MolangExpr =>
  new MolangExpr(
    args.length === 0
      ? `query.${camelToSnake(name)}`
      : `query.${camelToSnake(name)}(${callArgs(args)})`,
  );

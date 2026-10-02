import {
  MolangExpr,
  MolangPrecedence as P,
  toMolangExpr,
  wrapMolang,
  type MolangInput,
} from './expr';

const binary =
  (operator: string, precedence: number) =>
  (left: MolangInput, right: MolangInput): MolangExpr =>
    new MolangExpr(
      `${wrapMolang(left, precedence)} ${operator} ${wrapMolang(right, precedence + 1)}`,
      precedence,
    );

const variadic =
  (operator: string, precedence: number) =>
  (first: MolangInput, second: MolangInput, ...rest: MolangInput[]): MolangExpr =>
    [second, ...rest].reduce<MolangExpr>(
      (acc, next) => binary(operator, precedence)(acc, next),
      toMolangExpr(first),
    );

export const and = variadic('&&', P.And);
export const or = variadic('||', P.Or);
export const coalesce = binary('??', P.Coalesce);

export const eq = binary('==', P.Equality);
export const neq = binary('!=', P.Equality);
export const lt = binary('<', P.Comparison);
export const lte = binary('<=', P.Comparison);
export const gt = binary('>', P.Comparison);
export const gte = binary('>=', P.Comparison);

export const add = variadic('+', P.Additive);
export const sub = binary('-', P.Additive);
export const mul = variadic('*', P.Multiplicative);
export const div = binary('/', P.Multiplicative);

export const not = (value: MolangInput): MolangExpr =>
  new MolangExpr(`!${wrapMolang(value, P.Unary)}`, P.Unary);

export const neg = (value: MolangInput): MolangExpr =>
  new MolangExpr(`-${wrapMolang(value, P.Unary)}`, P.Unary);

export const ternary = (
  condition: MolangInput,
  onTrue: MolangInput,
  onFalse: MolangInput = 0,
): MolangExpr =>
  new MolangExpr(
    `${wrapMolang(condition, P.Coalesce)} ? ${wrapMolang(onTrue, P.Ternary)} : ${wrapMolang(onFalse, P.Ternary)}`,
    P.Ternary,
  );

/** Explicit parentheses. */
export const group = (value: MolangInput): MolangExpr =>
  new MolangExpr(`(${toMolangExpr(value).source})`);

/** `source->member`, access to a variable of another entity. */
export const arrow = (source: MolangInput, member: string): MolangExpr =>
  new MolangExpr(`${wrapMolang(source, P.Atom)}->${member}`);

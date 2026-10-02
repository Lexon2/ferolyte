import {
  MolangExpr,
  MolangPrecedence,
  MolangStatement,
  wrapMolang,
  type MolangInput,
} from './expr';

const interpolate = (
  strings: TemplateStringsArray,
  values: readonly (MolangInput | MolangStatement)[],
): string =>
  strings.reduce((result, part, index) => {
    if (index === 0) {
      return part;
    }
    const value = values[index - 1];
    const text =
      value instanceof MolangStatement
        ? value.source
        : wrapMolang(value, MolangPrecedence.Unary);
    return result + text + part;
  }, '');

/**
 * Tagged template, closest to native Molang. Static text is emitted as is,
 * interpolated values are parenthesised when needed; strings become literals.
 *
 * @example molang`${q.isMoving} && ${v('speed')} > 1 ? 1 : 0`
 */
export const molang = (
  strings: TemplateStringsArray,
  ...values: MolangInput[]
): MolangExpr =>
  new MolangExpr(interpolate(strings, values), MolangPrecedence.Ternary);

/** Same as {@link molang}, but produces a statement (`;` is appended). */
export const stmt = (
  strings: TemplateStringsArray,
  ...values: (MolangInput | MolangStatement)[]
): MolangStatement => new MolangStatement(interpolate(strings, values));

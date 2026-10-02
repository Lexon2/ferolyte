import type { MolangBuilder } from '../format-molang-value';

/**
 * Binding strength of an expression. A lower value binds weaker and gets
 * parenthesised when used as an operand of a stronger operator.
 */
export const MolangPrecedence = {
  Ternary: 1,
  Coalesce: 2,
  Or: 3,
  And: 4,
  Equality: 5,
  Comparison: 6,
  Additive: 7,
  Multiplicative: 8,
  Unary: 9,
  Atom: 10,
} as const;

/**
 * Immutable Molang expression. Every helper returns a new instance,
 * so any value can be safely reused.
 */
export class MolangExpr implements MolangBuilder {
  constructor(
    readonly source: string,
    readonly precedence: number = MolangPrecedence.Atom,
  ) {
    Object.freeze(this);
  }

  build(): string {
    return this.source;
  }

  toString(): string {
    return this.source;
  }

  valueOf(): string {
    return this.source;
  }

  [Symbol.toPrimitive](): string {
    return this.source;
  }
}

/**
 * Immutable Molang statement. Always ends with `;`.
 */
export class MolangStatement implements MolangBuilder {
  readonly source: string;

  constructor(source: string) {
    this.source = source.endsWith(';') ? source : `${source};`;
    Object.freeze(this);
  }

  build(): string {
    return this.source;
  }

  toString(): string {
    return this.source;
  }

  valueOf(): string {
    return this.source;
  }

  [Symbol.toPrimitive](): string {
    return this.source;
  }
}

/**
 * Value accepted by the helpers: numbers and booleans are emitted as is,
 * strings become quoted Molang string literals.
 */
export type MolangInput = number | boolean | string | MolangExpr;

export const quoteMolangString = (value: string): string =>
  `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

export const toMolangExpr = (value: MolangInput): MolangExpr => {
  if (value instanceof MolangExpr) {
    return value;
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new TypeError(`Molang number must be finite, got ${value}`);
    }
    return new MolangExpr(
      String(value),
      value < 0 ? MolangPrecedence.Unary : MolangPrecedence.Atom,
    );
  }
  if (typeof value === 'boolean') {
    return new MolangExpr(String(value));
  }
  return new MolangExpr(quoteMolangString(value));
};

/** Source of `value`, parenthesised when it binds weaker than `min`. */
export const wrapMolang = (value: MolangInput, min: number): string => {
  const expr = toMolangExpr(value);
  return expr.precedence < min ? `(${expr.source})` : expr.source;
};

/** Raw Molang source that is inserted as is. Use for anything not covered by helpers. */
export const raw = (
  source: string,
  precedence: number = MolangPrecedence.Ternary,
): MolangExpr => new MolangExpr(source, precedence);

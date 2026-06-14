import {
  appendMolangValue,
  formatMolangValue,
  type MolangBuilder,
  type MolangBuilderCallback,
  type MolangValue,
} from './format-molang-value';
import { MolangExpression } from './molang-expression';
import {
  createMathNamespace,
  type MolangMathCallable,
} from './namespaces/math-namespace';
import {
  createVariableNamespace,
  type MolangVariableNamespace,
} from './namespaces/variable-namespace';
import { MOLANG_QUERY_NAMES, type MolangQueryName } from './types/query-names';
import { camelToSnake, snakeToCamel } from './utils/case';

export type MolangOperator =
  | '&&'
  | '||'
  | '??'
  | '!'
  | '+'
  | '-'
  | '*'
  | '/'
  | '<'
  | '<='
  | '>'
  | '>='
  | '=='
  | '!=';

const QUERY_CAMEL_NAMES = new Set(
  MOLANG_QUERY_NAMES.map((name) => snakeToCamel(name)),
);

const QUERY_SNAKE_NAMES = new Set<string>(MOLANG_QUERY_NAMES);

const RESERVED_PROXY_KEYS = new Set([
  'math',
  'variable',
  'temp',
  'context',
  'v',
  't',
  'c',
  'q',
  'query',
  'op',
  'num',
  'str',
  'raw',
  'group',
  'build',
  'toString',
  'valueOf',
  'ternary',
  'returnExpr',
  'loop',
  'forEach',
  'arrow',
  'assignVariable',
  'and',
  'or',
  'not',
  'add',
  'sub',
  'mul',
  'div',
  'lt',
  'lte',
  'gt',
  'gte',
  'eq',
  'neq',
  'nullCoalesce',
  'constructor',
  'then',
  'catch',
  'finally',
]);

const createMolangProxy = (target: Molang): Molang => {
  return new Proxy(target, {
    get(obj, prop, receiver) {
      if (typeof prop === 'symbol') {
        return Reflect.get(obj, prop, receiver);
      }

      if (typeof prop !== 'string') {
        return Reflect.get(obj, prop, receiver);
      }

      if (prop in obj || RESERVED_PROXY_KEYS.has(prop)) {
        return Reflect.get(obj, prop, receiver);
      }

      const snakeName = camelToSnake(prop);
      if (QUERY_CAMEL_NAMES.has(prop) || QUERY_SNAKE_NAMES.has(snakeName)) {
        obj.appendFragment(`query.${snakeName}`);

        return receiver;
      }

      return Reflect.get(obj, prop, receiver);
    },
  }) as Molang;
};

export class Molang implements MolangBuilder {
  private readonly _expression = new MolangExpression();
  private readonly _mathBridge: MolangMathCallable;
  private readonly _variable: MolangVariableNamespace;
  private readonly _temp: MolangVariableNamespace;
  private readonly _context: MolangVariableNamespace;
  private readonly _v: MolangVariableNamespace;
  private readonly _t: MolangVariableNamespace;
  private readonly _c: MolangVariableNamespace;

  constructor(initial?: string) {
    if (initial !== undefined) {
      this._expression.append(initial);
    }

    this._mathBridge = createMathNamespace(this._expression, this);
    this._variable = createVariableNamespace(
      'variable',
      this._expression,
      this,
    );
    this._temp = createVariableNamespace('temp', this._expression, this);
    this._context = createVariableNamespace('context', this._expression, this);
    this._v = createVariableNamespace('v', this._expression, this);
    this._t = createVariableNamespace('t', this._expression, this);
    this._c = createVariableNamespace('c', this._expression, this);

    return createMolangProxy(this);
  }

  appendFragment(fragment: string): this {
    this._expression.append(fragment);

    return this;
  }

  get math(): MolangMathCallable {
    return this._mathBridge;
  }

  get variable(): MolangVariableNamespace {
    return this._variable;
  }

  get temp(): MolangVariableNamespace {
    return this._temp;
  }

  get context(): MolangVariableNamespace {
    return this._context;
  }

  get v(): MolangVariableNamespace {
    return this._v;
  }

  get t(): MolangVariableNamespace {
    return this._t;
  }

  get c(): MolangVariableNamespace {
    return this._c;
  }

  get q(): MolangVariableNamespace {
    return this._variable;
  }

  query<T extends `${MolangQueryName}`>(name: T, ...args: MolangValue[]): this {
    if (args.length === 0) {
      this._expression.append(`query.${name}`);

      return this;
    }

    this._expression.append(
      `query.${name}(${args.map(formatMolangValue).join(', ')})`,
    );

    return this;
  }

  op(operator: MolangOperator): this {
    if (operator === '!') {
      this._expression.append('!');

      return this;
    }

    this._expression.append(` ${operator} `);

    return this;
  }

  get and(): this {
    return this.op('&&');
  }

  get or(): this {
    return this.op('||');
  }

  get not(): this {
    return this.op('!');
  }

  get add(): this {
    return this.op('+');
  }

  get sub(): this {
    return this.op('-');
  }

  get mul(): this {
    return this.op('*');
  }

  get div(): this {
    return this.op('/');
  }

  get lt(): this {
    return this.op('<');
  }

  get lte(): this {
    return this.op('<=');
  }

  get gt(): this {
    return this.op('>');
  }

  get gte(): this {
    return this.op('>=');
  }

  get eq(): this {
    return this.op('==');
  }

  get neq(): this {
    return this.op('!=');
  }

  get nullCoalesce(): this {
    return this.op('??');
  }

  num(value: number): this {
    this._expression.append(String(value));

    return this;
  }

  str(value: string): this {
    this._expression.append(formatMolangValue(value));

    return this;
  }

  raw(fragment: string): this {
    this._expression.append(fragment);

    return this;
  }

  group(builder: MolangBuilderCallback<Molang>): this {
    this._expression.append('(');
    const nested = new Molang();
    builder(nested);
    this._expression.append(nested.build());
    this._expression.append(')');

    return this;
  }

  ternary(
    onTrue: MolangValue | MolangBuilderCallback<Molang>,
    onFalse: MolangValue | MolangBuilderCallback<Molang>,
  ): this {
    this._expression.append(' ? ');
    appendMolangValue(
      (fragment) => this._expression.append(fragment),
      onTrue,
      () => new Molang(),
    );
    this._expression.append(' : ');
    appendMolangValue(
      (fragment) => this._expression.append(fragment),
      onFalse,
      () => new Molang(),
    );

    return this;
  }

  returnExpr(builder: MolangBuilderCallback<Molang>): this {
    this._expression.append('return ');
    appendMolangValue(
      (fragment) => this._expression.append(fragment),
      builder,
      () => new Molang(),
    );
    this._expression.append(';');

    return this;
  }

  loop(count: MolangValue, builder: MolangBuilderCallback<Molang>): this {
    this._expression.append(`loop(${formatMolangValue(count)}, {`);
    appendMolangValue(
      (fragment) => this._expression.append(fragment),
      builder,
      () => new Molang(),
    );
    this._expression.append('});');

    return this;
  }

  forEach(
    variable: string,
    array: MolangValue,
    builder: MolangBuilderCallback<Molang>,
  ): this {
    this._expression.append(
      `for_each(${variable}, ${formatMolangValue(array)}, {`,
    );
    appendMolangValue(
      (fragment) => this._expression.append(fragment),
      builder,
      () => new Molang(),
    );
    this._expression.append('});');

    return this;
  }

  arrow(source: MolangValue, member: string): this {
    this._expression.append(`${formatMolangValue(source)}->${member}`);

    return this;
  }

  assignVariable(
    name: string,
    value: MolangValue | MolangBuilderCallback<Molang>,
  ): this {
    this._expression.append(`variable.${name} = `);
    appendMolangValue(
      (fragment) => this._expression.append(fragment),
      value,
      () => new Molang(),
    );
    this._expression.append(';');

    return this;
  }

  build(): string {
    return this._expression.build();
  }

  toString(): string {
    return this.build();
  }

  valueOf(): string {
    return this.build();
  }

  [Symbol.toPrimitive](): string {
    return this.build();
  }
}

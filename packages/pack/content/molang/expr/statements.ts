import {
  MolangStatement,
  toMolangExpr,
  type MolangExpr,
  type MolangInput,
} from './expr';

const body = (statements: readonly MolangStatement[]): string =>
  statements.map((statement) => statement.source).join(' ');

/** `target = value;` */
export const assign = (
  target: MolangExpr,
  value: MolangInput,
): MolangStatement =>
  new MolangStatement(`${target.source} = ${toMolangExpr(value).source}`);

/** `return value;` */
export const ret = (value: MolangInput): MolangStatement =>
  new MolangStatement(`return ${toMolangExpr(value).source}`);

/** `loop(count, {...});` */
export const loop = (
  count: MolangInput,
  ...statements: MolangStatement[]
): MolangStatement =>
  new MolangStatement(
    `loop(${toMolangExpr(count).source}, {${body(statements)}})`,
  );

/** `for_each(variable, array, {...});` */
export const forEach = (
  variable: MolangExpr,
  array: MolangInput,
  ...statements: MolangStatement[]
): MolangStatement =>
  new MolangStatement(
    `for_each(${variable.source}, ${toMolangExpr(array).source}, {${body(statements)}})`,
  );

export const breakLoop = (): MolangStatement => new MolangStatement('break');

export const continueLoop = (): MolangStatement =>
  new MolangStatement('continue');

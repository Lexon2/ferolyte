import { type MolangBuilder } from './format-molang-value';

export type MolangExpression = string | MolangBuilder;

/** Statement accepted by configs: a string (a missing `;` is appended), or any builder such as `MolangStatement`. */
export type MolangStatementInput = string | MolangBuilder;

export const parseMolangExpression = (value: MolangExpression): string => {
  if (typeof value === 'string') {
    return value;
  }

  return value.build();
};

export const parseMolangStatement = (value: MolangStatementInput): string => {
  const expression = parseMolangExpression(value);
  return expression.endsWith(';') ? expression : `${expression};`;
};

export type EntityScriptsAnimateItem =
  | string
  | Record<string, MolangExpression>;

export const formatEntityScriptsAnimate = (
  animate: EntityScriptsAnimateItem[],
): (Record<string, string> | string)[] => {
  const formattedAnimate: (Record<string, string> | string)[] = [];

  for (const item of animate) {
    if (typeof item === 'string') {
      formattedAnimate.push(item);
      continue;
    }

    for (const [key, value] of Object.entries(item)) {
      formattedAnimate.push({ [key]: parseMolangExpression(value) });
    }
  }

  return formattedAnimate;
};

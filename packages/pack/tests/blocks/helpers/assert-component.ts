import { expect } from 'vitest';

type ComponentCreator = (input?: unknown) => Record<string, unknown> | undefined;

export const expectUndefined = (creator: ComponentCreator, input?: unknown) => {
  expect(creator(input)).toBeUndefined();
};

export const expectComponent = (
  creator: ComponentCreator,
  input: unknown,
  minecraftKey: string,
  expectedValue: unknown,
) => {
  const result = creator(input);
  expect(result).toEqual({ [minecraftKey]: expectedValue });
};

export const expectMultiKey = (
  creator: ComponentCreator,
  input: unknown,
  expected: Record<string, unknown>,
) => {
  expect(creator(input)).toEqual(expected);
};

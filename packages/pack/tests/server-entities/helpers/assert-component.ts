import { expect } from 'vitest';

import type { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';

type ComponentCreator = (
  input?: unknown,
  ctx?: ContentDiagnosticContext,
) => Record<string, unknown> | undefined;

type FilterCreator = (
  input?: unknown,
  ctx?: ContentDiagnosticContext,
) => Record<string, unknown> | undefined;

export const expectUndefined = (
  creator: ComponentCreator | FilterCreator,
  input?: unknown,
  ctx?: ContentDiagnosticContext,
) => {
  expect(creator(input, ctx)).toBeUndefined();
};

export const expectComponent = (
  creator: ComponentCreator,
  input: unknown,
  minecraftKey: string,
  expectedValue: unknown,
  ctx?: ContentDiagnosticContext,
) => {
  const result = creator(input, ctx);
  expect(result).toEqual({ [minecraftKey]: expectedValue });
};

export const expectFilter = (
  creator: FilterCreator,
  input: unknown,
  expected: Record<string, unknown>,
  ctx?: ContentDiagnosticContext,
) => {
  expect(creator(input, ctx)).toEqual(expected);
};

import {
  ContentDiagnosticContext,
  logContentWarning,
  withFieldPath,
} from './content-diagnostic';

const SNAKE_CASE = /^[a-z][a-z0-9]*(_[a-z0-9]+)+$/;

export const snakeToCamel = (key: string): string =>
  key.replace(/_([a-z0-9])/g, (_, char: string) => char.toUpperCase());

export const isSnakeCase = (key: string): boolean => SNAKE_CASE.test(key);

/**
 * Warns when a component key is written in vanilla snake_case but the SDK
 * knows the camelCase form (`looked_at` -> `lookedAt`).
 * @returns `true` when a hint was reported.
 */
export const hintSnakeCaseComponent = (
  key: string,
  isKnown: (camelKey: string) => boolean,
  ctx: ContentDiagnosticContext | undefined,
): boolean => {
  if (!isSnakeCase(key)) {
    return false;
  }
  const camel = snakeToCamel(key);
  if (!isKnown(camel)) {
    return false;
  }

  logContentWarning(ctx, `"${key}" → use "${camel}"`);

  return true;
};

/**
 * Warns about snake_case keys at depth 1 of a typed component config. It never
 * descends, so free-form maps nested deeper are not flagged.
 */
export const hintSnakeCaseFields = (
  config: unknown,
  ctx: ContentDiagnosticContext | undefined,
): void => {
  if (typeof config !== 'object' || config === null || Array.isArray(config)) {
    return;
  }

  for (const key of Object.keys(config)) {
    if (isSnakeCase(key)) {
      logContentWarning(
        withFieldPath(ctx, key),
        `Ferolyte config uses camelCase: "${key}" → "${snakeToCamel(key)}"`,
      );
    }
  }
};

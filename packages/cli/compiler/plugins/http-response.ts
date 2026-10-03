import type { MinecraftHttpResponse } from './types';

/**
 * Marker of an explicit HTTP response envelope. `Symbol.for`, so a plugin that bundles its own
 * copy of this module is still recognised by the hub.
 */
export const HTTP_RESPONSE_MARKER = Symbol.for('ferolyte.httpResponse');

/**
 * Explicit HTTP response of a plugin route handler: `return httpResponse(404, { error: 'unknown id' })`.
 * Any other return value is sent as a `200` JSON body. API 1.2.0.
 */
export const httpResponse = (
  status: number,
  body?: unknown,
): MinecraftHttpResponse => ({
  [HTTP_RESPONSE_MARKER]: true,
  status,
  body,
} as MinecraftHttpResponse);

export const isMarkedHttpResponse = (value: unknown): value is MinecraftHttpResponse =>
  typeof value === 'object' &&
  value !== null &&
  (value as Record<symbol, unknown>)[HTTP_RESPONSE_MARKER] === true;

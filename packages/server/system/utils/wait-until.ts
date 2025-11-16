import { system } from '@minecraft/server';

/**
 * Waits until a function returns true.
 * @param fn - The function to wait for.
 * @param interval - The interval to wait between checks. `Default: 5 ticks`
 * @param maxTries - The maximum number of tries to wait for. `Default: 40 tries`
 * @returns `true` if the function returns `true`, `false` otherwise.
 */
export async function waitUntil(
  fn: () => boolean,
  interval = 5,
  maxTries = 40,
): Promise<boolean> {
  for (let i = 0; i < maxTries; i++) {
    if (fn()) {
      return true;
    }

    await system.waitTicks(interval);
  }

  return false;
}

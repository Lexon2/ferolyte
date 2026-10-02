import { logContentError } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import type { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';

/** Plain animation definition from an `.animation.json` file. */
export type AnimationDefinition = Record<string, unknown>;

export interface AnimationOptionContext {
  /** Id of the source animation. */
  animationId: string;
  /** Diagnostics context of the entity that uses the option. */
  diagnostics?: ContentDiagnosticContext;
}

/**
 * Patches a cloned animation. Mutate `animation` in place; return `false` to
 * report that the option could not be applied (the clone is then not created).
 */
export type AnimationOptionPatch = (
  animation: AnimationDefinition,
  value: unknown,
  context: AnimationOptionContext,
) => boolean | void;

const registry = new Map<string, AnimationOptionPatch>();

/**
 * Registers a `.ce.ts` animation option (e.g. `loop`, `blendWeight`) so that
 * `animations: { walk: { id, <name>: value } }` is applied at build time.
 */
export const registerAnimationOption = (
  name: string,
  patch: AnimationOptionPatch,
): void => {
  registry.set(name, patch);
};

export const unregisterAnimationOption = (name: string): void => {
  registry.delete(name);
};

export const getAnimationOption = (
  name: string,
): AnimationOptionPatch | undefined => registry.get(name);

const DEFAULT_ANIM_TIME_UPDATE =
  /^query\.anim_time\s*\+\s*query\.delta_time(?:\s*\*\s*(.+?))?\s*;?$/;

/**
 * `anim_time_update = query.anim_time + query.delta_time * (<speed>)`.
 * An existing `anim_time_update` is only multiplied when it has the default
 * form (`query.anim_time + query.delta_time [* <expr>]`), otherwise it is ambiguous.
 */
export const patchAnimationSpeed: AnimationOptionPatch = (
  animation,
  value,
  { animationId, diagnostics },
) => {
  const speed = String(value).trim();
  if (speed.length === 0 || speed === 'undefined') {
    logContentError(diagnostics, `Animation "${animationId}": empty speed`);

    return false;
  }

  const existing = animation.anim_time_update;
  let factor = `(${speed})`;
  if (typeof existing === 'string') {
    const match = DEFAULT_ANIM_TIME_UPDATE.exec(existing.trim());
    if (!match) {
      logContentError(
        diagnostics,
        `Animation "${animationId}" already has a custom anim_time_update ("${existing}"), speed is ambiguous`,
      );

      return false;
    }
    if (match[1] !== undefined) {
      factor = `${match[1].startsWith('(') ? match[1] : `(${match[1]})`} * ${factor}`;
    }
  }

  animation.anim_time_update = `query.anim_time + query.delta_time * ${factor}`;
};

registerAnimationOption('speed', patchAnimationSpeed);

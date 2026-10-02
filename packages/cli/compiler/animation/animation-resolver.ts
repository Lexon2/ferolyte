import { createHash } from 'crypto';

import { logContentError } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import type { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import type { ClientEntityAnimationOptions } from '@ferolyte/pack/content/client-entity/interfaces/animations-collection';
import { AnimationDefinition, getAnimationOption } from './animation-options';
import { IndexedAnimation } from './animation-index';

export interface AnimationClone {
  definition: AnimationDefinition;
  /** Format version of the source animation file. */
  formatVersion?: string;
}

export interface AnimationResolution {
  /** Derived id -> patched copy of the source animation. */
  clones: Map<string, AnimationClone>;
  /** Source `.animation.json` files the entity depends on. */
  sources: Set<string>;
}

/**
 * Creates the resolver used by `ClientEntityBuilder`: an animation with options
 * is cloned under `<id>.f_<hash>` (the hash covers the patched definition, so
 * entities with the same options share the clone id) and the source stays untouched.
 */
export const createAnimationResolver = (
  index: ReadonlyMap<string, IndexedAnimation>,
  diagnostics?: ContentDiagnosticContext,
) => {
  const resolution: AnimationResolution = {
    clones: new Map(),
    sources: new Set(),
  };

  const resolve = (
    _entity: string,
    key: string,
    options: ClientEntityAnimationOptions,
  ): string => {
    const { id, ...rest } = options;
    const source = index.get(id);
    const context = diagnostics && { ...diagnostics, fieldPath: `animations.${key}` };
    if (!source) {
      logContentError(context, `Animation "${id}" was not found in the resource pack animations`);

      return id;
    }
    resolution.sources.add(source.file);

    const entries = Object.entries(rest).filter(([, value]) => value !== undefined);
    if (entries.length === 0) {
      return id;
    }

    const definition = structuredClone(source.definition);
    for (const [name, value] of entries) {
      const patch = getAnimationOption(name);
      if (!patch) {
        logContentError(context, `Unknown animation option "${name}"`);

        return id;
      }
      if (patch(definition, value, { animationId: id, diagnostics: context }) === false) {
        return id;
      }
    }

    const hash = createHash('sha1')
      .update(JSON.stringify(definition))
      .digest('hex')
      .slice(0, 8);
    const derivedId = `${id}.f_${hash}`;
    resolution.clones.set(derivedId, {
      definition,
      formatVersion: source.format_version,
    });

    return derivedId;
  };

  return { resolve, resolution };
};

export const hasAnimationOptions = (
  animations: Record<string, unknown> | undefined,
): boolean =>
  Object.values(animations ?? {}).some(
    (value) => typeof value === 'object' && value !== null,
  );

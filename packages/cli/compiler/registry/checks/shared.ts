import { existsSync } from 'fs';
import { dirname, join } from 'path';

import {
  ContentDiagnosticContext,
  logContentError,
  logContentWarning,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { BUILD_CONTEXT } from '../../build-context';
import {
  isStrictReferences,
  ProjectDocument,
  RegistryIndex,
} from '../project-registry';
import { unknownMessage } from '../suggest';

const TEXTURE_EXTENSIONS = ['.png', '.tga', '.jpg', '.jpeg'];

export const report = (
  document: ProjectDocument,
  fieldPath: string,
  message: string,
): void => {
  const ctx: ContentDiagnosticContext = {
    sourceFile: document.source,
    contentType: document.kind,
    fieldPath,
    diagnostics: true,
  };
  if (isStrictReferences()) {
    logContentError(ctx, message);
  } else {
    logContentWarning(ctx, message);
  }
};

export const namespaceToken = (): string =>
  BUILD_CONTEXT.PACKS.NAMESPACE.toLowerCase().replace(/[^a-z0-9_]/g, '');

/**
 * Whether an id probably belongs to this project (and not to vanilla, which the
 * registry cannot know): it contains the pack namespace, or it lives next to
 * known project ids (same prefix up to the last dot).
 */
export const isOwned = (id: string, known: Iterable<string>): boolean => {
  const token = namespaceToken();
  if (token.length > 0 && id.toLowerCase().includes(token)) {
    return true;
  }
  const dot = id.lastIndexOf('.');
  // The shared prefix must be specific (>= 2 dots), so vanilla ids next to project ones are not flagged.
  if (dot <= 0 || id.slice(0, dot).split('.').length < 3) {
    return false;
  }
  const prefix = `${id.slice(0, dot)}.`;
  for (const candidate of known) {
    if (candidate.startsWith(prefix)) {
      return true;
    }
  }

  return false;
};

export const checkId = (
  document: ProjectDocument,
  fieldPath: string,
  what: string,
  id: unknown,
  known: ReadonlySet<string>,
  extraKnown: Iterable<string> = [],
): void => {
  if (typeof id !== 'string' || known.has(id)) {
    return;
  }
  const all = [...known, ...extraKnown];
  if (all.includes(id) || !isOwned(id, all)) {
    return;
  }
  report(document, fieldPath, unknownMessage(what, id, all));
};

/** Texture path missing in a folder the project owns (vanilla textures are not in the packs). */
export const checkTexturePath = (
  document: ProjectDocument,
  fieldPath: string,
  texture: unknown,
): void => {
  if (typeof texture !== 'string' || !texture.startsWith('textures/')) {
    return;
  }
  const root = BUILD_CONTEXT.PACKS.INPUT_RESOURCE_PACK_PATH;
  const base = join(root, texture);
  if (
    TEXTURE_EXTENSIONS.some((ext) => existsSync(`${base}${ext}`)) ||
    existsSync(base) ||
    !existsSync(dirname(base))
  ) {
    return;
  }
  report(document, fieldPath, `missing texture "${texture}" (no .png/.tga in the resource pack)`);
};

export const walk = (
  node: unknown,
  path: string,
  visit: (value: any, path: string) => void,
): void => {
  if (node === null || typeof node !== 'object') {
    return;
  }
  visit(node, path);
  for (const [key, child] of Object.entries(node)) {
    walk(child, path ? `${path}.${key}` : key, visit);
  }
};

/** Checks the shared render description of a client entity or attachable. */
export const checkRenderDescription = (
  document: ProjectDocument,
  description: any,
  index: RegistryIndex,
) => {
  if (!description) {
    return;
  }

  for (const [key, geometry] of Object.entries(description.geometry ?? {})) {
    checkId(document, `geometry.${key}`, 'geometry', geometry, index.geometries);
  }

  const animationIds = new Set([
    ...index.animations,
    ...index.generatedAnimations,
    ...index.animationControllers,
  ]);
  for (const [key, animation] of Object.entries(description.animations ?? {})) {
    checkId(document, `animations.${key}`, 'animation', animation, animationIds);
  }

  const renderControllers: unknown[] = Array.isArray(description.render_controllers)
    ? description.render_controllers
    : [];
  for (const item of renderControllers) {
    const id = typeof item === 'string' ? item : Object.keys(item ?? {})[0];
    checkId(document, 'render_controllers', 'render controller', id, index.renderControllers);
  }

  for (const [key, texture] of Object.entries(description.textures ?? {})) {
    checkTexturePath(document, `textures.${key}`, texture);
  }

  const animationKeys = new Set(Object.keys(description.animations ?? {}));
  const animate: unknown[] = Array.isArray(description.scripts?.animate)
    ? description.scripts.animate
    : [];
  for (const item of animate) {
    const name = typeof item === 'string' ? item : Object.keys(item ?? {})[0];
    if (typeof name === 'string' && !animationKeys.has(name)) {
      report(
        document,
        'scripts.animate',
        unknownMessage('animation key', name, animationKeys),
      );
    }
  }
};


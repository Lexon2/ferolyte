import { mkdtemp, readFile, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  createAnimationController,
  defineBpState,
  defineRpState,
} from '@ferolyte/pack/animation';
import { createAttachable } from '@ferolyte/pack/content/attachable/create-attachable';
import { createClientEntity } from '@ferolyte/pack/content/client-entity/create-client-entity';
import { createRenderController } from '@ferolyte/pack/content/render-controller/create-render-controller';
import { not, q } from '@ferolyte/pack/molang';
import { BUILD_CONTEXT } from '../build-context';
import { buildContentJson } from './content.factory';
import { buildContentSuffixRegistry } from './utils/content-suffix-registry';

/**
 * Bare Molang values (`q.isMoving`, not wrapped in a template) are callable objects that `structuredClone` cannot copy;
 * the compiler clones configs (`cloneConfig()`), so every content type is built through `buildContentJson` here.
 */
let root: string;

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'ferolyte-molang-'));
  BUILD_CONTEXT.PACKS.OUTPUT_BEHAVIOR_PACK_PATH = join(root, 'BP');
  BUILD_CONTEXT.PACKS.OUTPUT_RESOURCE_PACK_PATH = join(root, 'RP');
  BUILD_CONTEXT.PACKS.OUTPUT_NAMESPACE_PATH = 'ns';
  BUILD_CONTEXT.PACKS.CONTENT_SUFFIX_REGISTRY = buildContentSuffixRegistry();
});

afterEach(() => rm(root, { recursive: true, force: true }));

const build = async (file: string, builder: unknown) => {
  const result = await buildContentJson(
    join(root, 'src', file),
    { default: builder },
    { debug: true, diagnostics: true },
  );
  if (result instanceof Error || result === undefined) {
    throw result ?? new Error('build returned nothing');
  }

  return JSON.parse(await readFile(result.outFile[0], 'utf-8'));
};

describe('bare Molang values through the compiler', () => {
  it('animation controller transitions (RP)', async () => {
    const idle = defineRpState({ animations: ['idle'], transitions: [{ walk: q.isMoving }] });
    const walk = defineRpState({ animations: ['walk'], transitions: [{ idle: not(q.isMoving) }] });
    const json = await build(
      'move.ac.rp.ts',
      createAnimationController({
        id: 'controller.animation.t.move',
        initialState: 'idle',
        states: { idle, walk },
      }),
    );

    expect(json.animation_controllers['controller.animation.t.move'].states.idle.transitions).toEqual([
      { walk: 'query.is_moving' },
    ]);
  });

  it('animation controller transitions (BP)', async () => {
    const json = await build(
      'move.ac.bp.ts',
      createAnimationController({
        id: 'controller.animation.t.bp',
        initialState: 'default',
        states: {
          default: defineBpState({ transitions: [{ done: q.allAnimationsFinished }] }),
          done: defineBpState({}),
        },
      }),
    );

    expect(json.animation_controllers['controller.animation.t.bp'].states.default.transitions).toEqual([
      { done: 'query.all_animations_finished' },
    ]);
  });

  it('render controller values', async () => {
    const json = await build(
      'mob.rc.ts',
      createRenderController({
        id: 'controller.render.t.mob',
        geometry: 'Geometry.default',
        materials: [{ '*': 'Material.default' }],
        textures: ['Texture.default'],
        partVisibility: [{ '*': true }, { blade: q.isSneaking }],
      }),
    );

    expect(json.render_controllers['controller.render.t.mob'].part_visibility).toEqual([
      { '*': true },
      { blade: 'query.is_sneaking' },
    ]);
  });

  it('client entity and attachable scripts', async () => {
    const entity = await build(
      'mob.ce.ts',
      createClientEntity({
        identifier: 'ns:mob',
        animations: { walk: 'animation.mob.walk' },
        scripts: { animate: [{ walk: q.isMoving }] },
      }),
    );
    expect(entity['minecraft:client_entity'].description.scripts.animate).toEqual([
      { walk: 'query.is_moving' },
    ]);

    const attachable = await build(
      'wand.att.ts',
      createAttachable({
        identifier: 'ns:wand',
        item: { 'ns:wand': q.isOwnerIdentifierAny('minecraft:player') },
        animations: { hold: 'animation.wand.hold' },
        scripts: { animate: [{ hold: q.isSneaking }] },
      }),
    );
    expect(attachable['minecraft:attachable'].description.scripts.animate).toEqual([
      { hold: 'query.is_sneaking' },
    ]);
  });
});

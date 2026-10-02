import { mkdtemp, readFile, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createAttachable } from '@ferolyte/pack/content/documents/create-attachable';
import { createRecipe } from '@ferolyte/pack/content/documents/create-recipe';
import { createRenderController } from '@ferolyte/pack/content/documents/create-render-controller';
import { createSpawnRule } from '@ferolyte/pack/content/documents/create-spawn-rule';
import { BUILD_CONTEXT } from '../../build-context';
import { buildContentJson } from '../content.factory';
import { buildContentSuffixRegistry } from '../utils/content-suffix-registry';

let root: string;

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'ferolyte-doc-'));
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
    { debug: true, diagnostics: false },
  );
  expect(result).not.toBeInstanceOf(Error);
  const outFile = (result as { outFile: string[] }).outFile;
  expect(outFile).toHaveLength(1);

  return {
    path: outFile[0],
    json: JSON.parse(await readFile(outFile[0], 'utf-8')),
  };
};

describe('buildContentJson with generated documents', () => {
  it('writes an attachable into the resource pack', async () => {
    const { path, json } = await build(
      'wand.att.ts',
      createAttachable({
        attachable: {
          description: {
            identifier: 'test:wand',
            geometry: { default: 'geometry.wand' },
          },
        },
      }),
    );

    expect(path).toBe(join(root, 'RP', 'attachables', 'ns', 'wand.att.json'));
    expect(json).toEqual({
      format_version: '1.10.0',
      'minecraft:attachable': {
        description: {
          identifier: 'test:wand',
          geometry: { default: 'geometry.wand' },
        },
      },
    });
  });

  it('names a render controller file after its source file', async () => {
    const { path, json } = await build(
      'mob.rc.ts',
      createRenderController({
        renderControllers: {
          'controller.render.mob': {
            geometry: 'Geometry.default',
            materials: [{ '*': 'Material.default' }],
            textures: ['Texture.default'],
          },
        },
      }),
    );

    expect(path).toBe(
      join(root, 'RP', 'render_controllers', 'ns', 'mob.rc.json'),
    );
    expect(json.render_controllers['controller.render.mob'].geometry).toBe(
      'Geometry.default',
    );
  });

  it('writes recipes and spawn rules into the behavior pack', async () => {
    const recipe = await build(
      'plank.recipe.ts',
      createRecipe({
        furnace: {
          description: { identifier: 'test:smelt' },
          input: 'test:ore',
          output: 'test:ingot',
        },
      }),
    );
    expect(recipe.path).toBe(
      join(root, 'BP', 'recipes', 'ns', 'smelt.recipe.json'),
    );
    expect(recipe.json['minecraft:recipe_furnace'].output).toBe('test:ingot');

    const spawn = await build(
      'mob.spawn.ts',
      createSpawnRule({
        spawnRules: {
          description: { identifier: 'test:mob', populationControl: 'animal' },
          conditions: [{ weight: { default: 10 } }],
        },
      }),
    );
    expect(spawn.path).toBe(
      join(root, 'BP', 'spawn_rules', 'ns', 'mob.spawn.json'),
    );
    expect(spawn.json['minecraft:spawn_rules'].conditions).toEqual([
      { 'minecraft:weight': { default: 10 } },
    ]);
  });
});

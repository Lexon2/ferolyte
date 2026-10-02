import { describe, expect, it } from 'vitest';

import { collectDiagnostics } from '@ferolyte/cli/compiler/check/diagnostics-collector';
import { CONTENT_METADATA } from '@ferolyte/common/content/metadata';
import {
  DocumentKind,
  convertDocument,
  documentRegistry,
} from '@ferolyte/pack/content/documents/convert-document';
import { DocumentBuilder } from '@ferolyte/pack/content/documents/document-builder';
import { spawnRuleConditionRegistry } from '@ferolyte/pack/content/generated/spawn-rule/registry';
import { createAttachable } from '@ferolyte/pack/content/documents/create-attachable';
import { createRecipe } from '@ferolyte/pack/content/documents/create-recipe';
import { createRenderController } from '@ferolyte/pack/content/documents/create-render-controller';
import { createSpawnRule } from '@ferolyte/pack/content/documents/create-spawn-rule';

const run = (fn: () => Record<string, unknown>) => {
  const collector = collectDiagnostics({ silent: true });
  const json = fn();
  collector.stop();

  return {
    json: json as any,
    errors: collector.records.filter((r) => r.severity === 'error'),
    warnings: collector.records.filter((r) => r.severity === 'warning'),
  };
};

const ctx = (contentType: 'attachable' | 'render-controller' | 'recipe' | 'spawn-rule') =>
  ({ contentType, diagnostics: true }) as const;

describe('convertDocument', () => {
  it('has a generated entry per document kind', () => {
    const kinds: DocumentKind[] = [
      'attachable',
      'renderController',
      'recipe',
      'spawnRule',
    ];
    for (const kind of kinds) {
      expect(typeof documentRegistry[kind].validate).toBe('function');
      expect(documentRegistry[kind].kind).toBe('document');
    }
  });

  it('renames the SDK keys of an attachable and keeps user maps verbatim', () => {
    const { json, errors } = run(() =>
      convertDocument(
        'attachable',
        {
          formatVersion: '1.10.0',
          attachable: {
            description: {
              identifier: 'test:wand',
              materials: { default: 'entity_alphatest', my_glow: 'entity_emissive' },
              textures: { default: 'textures/items/wand' },
              geometry: { default: 'geometry.wand' },
              renderControllers: ['controller.render.item_default'],
              minEngineVersion: '1.16.0',
            },
          },
        },
        ctx('attachable'),
      ),
    );

    expect(errors).toEqual([]);
    expect(json).toEqual({
      format_version: '1.10.0',
      'minecraft:attachable': {
        description: {
          identifier: 'test:wand',
          materials: { default: 'entity_alphatest', my_glow: 'entity_emissive' },
          textures: { default: 'textures/items/wand' },
          geometry: { default: 'geometry.wand' },
          render_controllers: ['controller.render.item_default'],
          min_engine_version: '1.16.0',
        },
      },
    });
  });

  it('reports unknown fields with a hint and does not write them', () => {
    const { json, errors } = run(() =>
      convertDocument(
        'attachable',
        {
          formatVersion: '1.10.0',
          attachable: {
            description: { identifier: 'test:wand', renderController: [] },
          },
        } as never,
        ctx('attachable'),
      ),
    );

    expect(json['minecraft:attachable'].description).toEqual({
      identifier: 'test:wand',
    });
    expect(errors.map((e) => e.message).join('\n')).toContain(
      'Did you mean "renderControllers"',
    );
    expect(errors[0].fieldPath).toBe('attachable.description.renderController');
  });

  it('keeps invalid values and reports them', () => {
    const { json, errors } = run(() =>
      convertDocument(
        'spawnRule',
        {
          formatVersion: '1.8.0',
          spawnRules: {
            description: { identifier: 'test:mob', populationControl: 'nope' },
          },
        } as never,
        ctx('spawn-rule'),
      ),
    );

    expect(json['minecraft:spawn_rules'].description.population_control).toBe(
      'nope',
    );
    expect(errors.some((e) => e.message.includes('Must be one of'))).toBe(true);
  });

  it('fills the format version from the options and reports it when absent', () => {
    const withOption = run(() =>
      convertDocument(
        'renderController',
        {
          renderControllers: {
            'controller.render.test': {
              geometry: 'Geometry.default',
              materials: [{ '*': 'Material.default' }],
              textures: ['Texture.default'],
            },
          },
        },
        ctx('render-controller'),
        { formatVersion: '1.10.0' },
      ),
    );
    expect(withOption.errors).toEqual([]);
    expect(withOption.json.format_version).toBe('1.10.0');
    expect(Object.keys(withOption.json.render_controllers)).toEqual([
      'controller.render.test',
    ]);

    const without = run(() =>
      convertDocument(
        'attachable',
        { attachable: { description: { identifier: 'test:wand' } } },
        ctx('attachable'),
      ),
    );
    expect(without.errors.map((e) => e.message)).toContain(
      'Missing required field "formatVersion"',
    );
  });

  it('converts a shaped recipe', () => {
    const recipe = run(() =>
      convertDocument(
        'recipe',
        {
          formatVersion: '1.20.10',
          shaped: {
            description: { identifier: 'test:stick_block' },
            tags: ['crafting_table'],
            pattern: ['##', '##'],
            key: { '#': { item: 'minecraft:stick' } },
            result: { item: 'test:stick_block', count: 1 },
            assumeSymmetry: true,
          },
        },
        ctx('recipe'),
      ),
    );
    expect(recipe.errors).toEqual([]);
    expect(recipe.json['minecraft:recipe_shaped'].assume_symmetry).toBe(true);
  });

  it('names spawn rule conditions like the generated condition area', () => {
    const spawn = run(() =>
      convertDocument(
        'spawnRule',
        {
          formatVersion: '1.8.0',
          spawnRules: {
            description: { identifier: 'test:mob', populationControl: 'animal' },
            conditions: [
              {
                weight: { default: 10 },
                herd: { minSize: 2, maxSize: 4 },
                spawnsOnSurface: {},
                biomeFilter: { test: 'has_biome_tag', value: 'plains' },
              },
            ],
          },
        },
        ctx('spawn-rule'),
      ),
    );

    expect(spawn.errors).toEqual([]);
    expect(spawn.json['minecraft:spawn_rules'].conditions[0]).toEqual({
      'minecraft:weight': { default: 10 },
      'minecraft:herd': { min_size: 2, max_size: 4 },
      'minecraft:spawns_on_surface': {},
      'minecraft:biome_filter': { test: 'has_biome_tag', value: 'plains' },
    });
  });
});

describe('spawn rule conditions area', () => {
  it('is generated from the schemas', () => {
    expect(spawnRuleConditionRegistry.weight.key).toBe('minecraft:weight');
    expect(spawnRuleConditionRegistry.herd.kind).toBe('condition');
    expect(spawnRuleConditionRegistry.biomeFilter.key).toBe(
      'minecraft:biome_filter',
    );
  });
});

describe('DocumentBuilder', () => {
  it('is a content builder with the matching metadata and file identifier', () => {
    const attachable = createAttachable({
      attachable: { description: { identifier: 'test:wand' } },
    });
    expect(attachable.metadata).toBe(CONTENT_METADATA.ATTACHABLE);
    expect(attachable.identifier()).toBe('test:wand');

    const recipe = createRecipe({
      furnace: { description: { identifier: 'test:smelt' } },
    });
    expect(recipe.metadata).toBe(CONTENT_METADATA.RECIPE);
    expect(recipe.identifier()).toBe('test:smelt');

    expect(
      createSpawnRule({
        spawnRules: {
          description: { identifier: 'test:mob', populationControl: 'animal' },
        },
      }).identifier(),
    ).toBe('test:mob');
    expect(createRenderController({}).identifier()).toBeUndefined();
    expect(createRenderController({}) instanceof DocumentBuilder).toBe(true);
  });

  it('builds with the default format version and clones its config', () => {
    const builder = createAttachable({
      attachable: { description: { identifier: 'test:wand' } },
    }).withBuildContext({ diagnostics: false });
    const { json } = run(() => builder.build());

    expect(json.format_version).toBe('1.10.0');
    const clone = builder.cloneConfig();
    clone.attachable = undefined;
    expect(builder.cloneConfig().attachable).toBeDefined();
  });
});

import { afterEach, describe, expect, it, vi } from 'vitest';

import { createAttachable } from '@ferolyte/pack/content/attachable/create-attachable';
import { createClientEntity } from '@ferolyte/pack/content/client-entity/create-client-entity';
import { RenderControllerBuilder } from '@ferolyte/pack/content/render-controller/render-controller-builder';
import { createRenderController } from '@ferolyte/pack/content/render-controller/create-render-controller';
import { q, v } from '@ferolyte/pack/molang';

afterEach(() => vi.restoreAllMocks());

describe('createAttachable', () => {
  it('uses the same flat form as createClientEntity', () => {
    const shared = {
      geometry: 'geometry.ns.sword',
      textures: { default: 'textures/ns/sword' },
      materials: 'entity_alphatest',
      animations: { hold: 'animation.ns.sword.hold' },
      renderControllers: ['controller.render.item_default'],
      scripts: { animate: ['hold'], scaleX: 'variable.s' },
    };

    const attachable = createAttachable({
      identifier: 'ns:sword',
      item: { 'ns:sword': q.isOwnerIdentifierAny('minecraft:player') },
      ...shared,
    }).build() as any;
    const entity = createClientEntity({ identifier: 'ns:thing', ...shared } as any).build();
    const description = attachable['minecraft:attachable'].description;
    const entityDescription = entity['minecraft:client_entity'].description;

    expect(attachable.format_version).toBe('1.10.0');
    expect(description.item).toEqual({ 'ns:sword': "query.is_owner_identifier_any('minecraft:player')" });
    expect(description.geometry).toEqual({ default: 'geometry.ns.sword' });
    expect(description.materials).toEqual({ default: 'entity_alphatest' });
    for (const key of ['geometry', 'textures', 'materials', 'animations', 'render_controllers', 'scripts']) {
      expect(description[key]).toEqual(entityDescription[key]);
    }
  });

  it('string item shorthand and animation resolver', () => {
    const builder = createAttachable({
      identifier: 'ns:sword',
      item: 'ns:sword',
      animations: { hold: { id: 'animation.ns.sword.hold', speed: 2 } },
    }).withAnimationResolver((_entity, _key, options) => `${options.id}.f_1`);

    const description = (builder.build() as any)['minecraft:attachable'].description;

    expect(description.item).toEqual({ 'ns:sword': 'true' });
    expect(description.animations.hold).toBe('animation.ns.sword.hold.f_1');
  });
});

describe('client entity fields shared with attachables', () => {
  it('writes animation_controllers, scaleX/Y/Z, hide_held_items, held_item_scale and keeps strings as they are', () => {
    const entity = createClientEntity({
      identifier: 'ns:e',
      animationControllers: [{ general: 'controller.animation.ns.general' }],
      heldItemScale: 2.5,
      scripts: {
        scaleX: 'variable.x',
        scaleY: 'variable.y',
        scaleZ: 'variable.z',
        hideHeldItems: 'variable.hide',
        preAnimation: ['(variable.a) ? {', 'variable.b = 1;', q.isBaby],
      },
    }).build()['minecraft:client_entity'].description;

    expect(entity.animation_controllers).toEqual([{ general: 'controller.animation.ns.general' }]);
    expect(entity.held_item_scale).toBe(2.5);
    expect(entity.scripts).toMatchObject({
      scaleX: 'variable.x',
      scaleY: 'variable.y',
      scaleZ: 'variable.z',
      hide_held_items: 'variable.hide',
      pre_animation: ['(variable.a) ? {', 'variable.b = 1;', 'query.is_baby;'],
    });
  });
});

describe('createRenderController', () => {
  it('builds one controller with Molang v2 and strings', () => {
    const json = createRenderController({
      id: 'controller.render.ns.skins',
      geometry: 'Geometry.default',
      materials: [{ '*': 'Material.default' }],
      textures: ['Array.skins[v.skin]'],
      arrays: { textures: { 'Array.skins': ['Texture.a', 'Texture.b'] } },
      partVisibility: [{ '*': true }, { head: q.isBaby }],
      isHurtColor: { r: 1, g: 0, b: 0, a: 0.5 },
    } as any).build() as any;

    expect(json.format_version).toBe('1.10.0');
    const body = json.render_controllers['controller.render.ns.skins'];
    expect(body.geometry).toBe('Geometry.default');
    expect(body.arrays.textures['Array.skins']).toEqual(['Texture.a', 'Texture.b']);
    expect(body.part_visibility).toEqual([{ '*': true }, { head: 'query.is_baby' }]);
    expect(body.is_hurt_color).toEqual({ r: 1, g: 0, b: 0, a: 0.5 });
    void v;
  });

  it('writes several controllers of a file into one JSON and validates the id prefix', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const a = createRenderController({ id: 'controller.render.ns.a', geometry: 'Geometry.default' });
    const b = createRenderController({ id: 'controller.render.ns.b', geometry: 'Geometry.default' });

    const json = RenderControllerBuilder.buildFile([a, b]) as any;
    expect(Object.keys(json.render_controllers)).toEqual(['controller.render.ns.a', 'controller.render.ns.b']);

    createRenderController({ id: 'nope' as any, geometry: 'Geometry.default' })
      .withBuildContext({ sourceFile: 'x.rc.ts' })
      .build();
    expect(error).toHaveBeenCalled();
  });
});

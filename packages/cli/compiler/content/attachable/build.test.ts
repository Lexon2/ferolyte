import { mkdir, mkdtemp, readFile, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { dirname, join } from 'path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createAttachable } from '@ferolyte/pack/content/attachable/create-attachable';
import { createRenderController } from '@ferolyte/pack/content/render-controller/create-render-controller';
import { BUILD_CONTEXT } from '../../build-context';
import { clearAnimationIndex } from '../../animation/animation-index';
import { clearGraph, setEntryInputs } from '../../core/graph';
import { buildContentJson } from '../content.factory';
import { buildContentSuffixRegistry } from '../utils/content-suffix-registry';

let root: string;

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'ferolyte-att-'));
  BUILD_CONTEXT.PACKS.INPUT_RESOURCE_PACK_PATH = join(root, 'in/RP');
  BUILD_CONTEXT.PACKS.OUTPUT_BEHAVIOR_PACK_PATH = join(root, 'out/BP');
  BUILD_CONTEXT.PACKS.OUTPUT_RESOURCE_PACK_PATH = join(root, 'out/RP');
  BUILD_CONTEXT.PACKS.OUTPUT_NAMESPACE_PATH = 'ns';
  BUILD_CONTEXT.PACKS.CONTENT_SUFFIX_REGISTRY = buildContentSuffixRegistry();
  clearAnimationIndex();
  clearGraph();

  const file = join(root, 'in/RP/animations/sword.animation.json');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(
    file,
    JSON.stringify({
      format_version: '1.8.0',
      animations: { 'animation.ns.sword.hold': { loop: true, animation_length: 1 } },
    }),
  );
});

afterEach(() => rm(root, { recursive: true, force: true }));

describe('buildContentJson with attachables and render controllers', () => {
  it('writes the flat attachable and clones animations with options', async () => {
    const source = join(root, 'src', 'sword.att.ts');
    setEntryInputs(source, []);

    const result = await buildContentJson(
      source,
      {
        default: createAttachable({
          identifier: 'ns:sword',
          geometry: 'geometry.ns.sword',
          animations: { hold: { id: 'animation.ns.sword.hold', speed: 2 } },
        }),
      },
      { debug: true, diagnostics: false },
    );

    expect(result).not.toBeInstanceOf(Error);
    const outFile = (result as { outFile: string[] }).outFile;
    expect(outFile).toHaveLength(2);

    const attachable = JSON.parse(await readFile(outFile[0], 'utf-8'));
    const hold = attachable['minecraft:attachable'].description.animations.hold;
    expect(outFile[0].replace(/\\/g, '/')).toContain('RP/attachables/ns/sword.att.json');
    expect(hold).toMatch(/^animation\.ns\.sword\.hold\.f_[0-9a-f]{8}$/);

    const clones = JSON.parse(await readFile(outFile[1], 'utf-8'));
    expect(clones.animations[hold].anim_time_update).toBe('query.anim_time + query.delta_time * (2)');
  });

  it('writes several render controllers of one file into one JSON', async () => {
    const result = await buildContentJson(
      join(root, 'src', 'skins.rc.ts'),
      {
        default: [
          createRenderController({ id: 'controller.render.ns.a', geometry: 'Geometry.default' }),
          createRenderController({ id: 'controller.render.ns.b', geometry: 'Geometry.default' }),
        ],
      },
      { debug: true, diagnostics: false },
    );

    expect(result).not.toBeInstanceOf(Error);
    const outFile = (result as { outFile: string[] }).outFile;
    expect(outFile).toHaveLength(1);
    expect(outFile[0].replace(/\\/g, '/')).toContain('RP/render_controllers/ns/skins.rc.json');
    const json = JSON.parse(await readFile(outFile[0], 'utf-8'));
    expect(Object.keys(json.render_controllers)).toEqual(['controller.render.ns.a', 'controller.render.ns.b']);
  });
});

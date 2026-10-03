import { mkdir, mkdtemp, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { dirname, join } from 'path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { BUILD_CONTEXT } from '../build-context';
import { generateIdsSource } from './ids-generator';
import { buildIndex, clearRegistry, scanResources } from './project-registry';

let root: string;

const write = async (path: string, content: unknown) => {
  const file = join(root, path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(content));
};

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'ferolyte-bpids-'));
  BUILD_CONTEXT.PACKS.INPUT_RESOURCE_PACK_PATH = join(root, 'RP');
  BUILD_CONTEXT.PACKS.INPUT_BEHAVIOR_PACK_PATH = join(root, 'BP');
  clearRegistry();
});

afterEach(async () => {
  clearRegistry();
  await rm(root, { recursive: true, force: true });
});

describe('animation ids of both packs', () => {
  it('keeps RP and BP ids apart: AnimationId/AnimationControllerId are RP, Bp* are BP', async () => {
    await write('RP/animations/a.animation.json', { animations: { 'animation.ns.rp_walk': {} } });
    await write('RP/animation_controllers/a.json', {
      animation_controllers: { 'controller.animation.ns.rp_move': {} },
    });
    await write('BP/animations/b.animation.json', { animations: { 'animation.ns.bp_tick': {} } });
    await write('BP/animation_controllers/b.json', {
      animation_controllers: { 'controller.animation.ns.bp_flow': {} },
    });
    await scanResources();

    const { text } = generateIdsSource(buildIndex());
    const section = (name: string) =>
      text.slice(text.indexOf(`export const ${name} = {`), text.indexOf('} as const;', text.indexOf(`export const ${name} = {`)));

    expect(section('AnimationId')).toContain("NsRpWalk: 'animation.ns.rp_walk'");
    expect(section('AnimationId')).not.toContain('bp_tick');
    expect(section('AnimationControllerId')).toContain("NsRpMove: 'controller.animation.ns.rp_move'");
    expect(section('BpAnimationId')).toContain("NsBpTick: 'animation.ns.bp_tick'");
    expect(section('BpAnimationControllerId')).toContain("NsBpFlow: 'controller.animation.ns.bp_flow'");
    expect(text).toContain('export type BpAnimationId');
  });
});

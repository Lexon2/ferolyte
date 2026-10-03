import { mkdtemp, readFile, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createServerEntity } from '@ferolyte/pack/content/server-entity/create-server-entity';
import { BUILD_CONTEXT } from '../../build-context';
import { collectDiagnostics } from '../../check/diagnostics-collector';
import { buildContentJson } from '../content.factory';
import { buildContentSuffixRegistry } from '../utils/content-suffix-registry';

let root: string;

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'ferolyte-events-'));
  BUILD_CONTEXT.PACKS.OUTPUT_BEHAVIOR_PACK_PATH = join(root, 'BP');
  BUILD_CONTEXT.PACKS.OUTPUT_RESOURCE_PACK_PATH = join(root, 'RP');
  BUILD_CONTEXT.PACKS.OUTPUT_NAMESPACE_PATH = 'ns';
  BUILD_CONTEXT.PACKS.CONTENT_SUFFIX_REGISTRY = buildContentSuffixRegistry();
});

afterEach(() => rm(root, { recursive: true, force: true }));

const build = async (events: Record<string, any>) => {
  const collector = collectDiagnostics({ silent: true });
  const result = await buildContentJson(
    join(root, 'src', 'x.se.ts'),
    { default: createServerEntity({ identifier: 'ns:x', events }) },
    { debug: true, diagnostics: true },
  );
  collector.stop();
  const json =
    result === undefined || result instanceof Error
      ? undefined
      : JSON.parse(await readFile(result.outFile[0], 'utf-8'));

  return {
    events: json?.['minecraft:entity'].events as Record<string, any> | undefined,
    errors: collector.records.filter((r) => r.severity === 'error').map((r) => r.message),
  };
};

describe('entity events through the compiler', () => {
  it('writes stopMovement with one flag or none, at any depth', async () => {
    const { events, errors } = await build({
      one: { stopMovement: { stopVerticalMovement: true } },
      none: { stopMovement: {} },
      deep: { sequence: [{ randomize: [{ weight: 1, stopMovement: { stopHorizontalMovement: false } }] }] },
    });

    expect(errors).toEqual([]);
    expect(events).toEqual({
      one: { stop_movement: { stop_vertical_movement: true } },
      none: { stop_movement: {} },
      deep: { sequence: [{ randomize: [{ weight: 1, stop_movement: { stop_horizontal_movement: false } }] }] },
    });
  });

  it('never drops an event silently: a failed event is reported by name', async () => {
    const { events, errors } = await build({
      broken: { stopMovement: { stopVerticalMovement: 'yes' } },
      fine: { trigger: 'ns:other' },
    });

    expect(events).toEqual({ fine: { trigger: 'ns:other' } });
    expect(errors.join('\n')).toContain('Event "broken" is not written');
  });
});

import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join, resolve } from 'path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { BUILD_CONTEXT } from '../build-context';
import { clearGraph, setEntryInputs } from '../core/graph';
import { settleAfterPass } from './generate-types';
import { getIdsFilePath } from './ids-generator';
import {
  beginSourceDocuments,
  clearRegistry,
  commitSourceDocuments,
  registerContentJson,
} from './project-registry';

let root: string;
let previousCwd: string;

const entity = (id: string) => ({
  format_version: '1.21.70',
  'minecraft:entity': { description: { identifier: id } },
});

const register = (source: string, id: string) => {
  beginSourceDocuments(source);
  registerContentJson(source, 'server-entity', entity(id));
  commitSourceDocuments(source);
};

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'ferolyte-settle-'));
  previousCwd = process.cwd();
  process.chdir(root);
  BUILD_CONTEXT.PACKS.INPUT_RESOURCE_PACK_PATH = join(root, 'RP');
  BUILD_CONTEXT.PACKS.INPUT_BEHAVIOR_PACK_PATH = join(root, 'BP');
  clearRegistry();
  clearGraph();
});

afterEach(async () => {
  process.chdir(previousCwd);
  clearRegistry();
  clearGraph();
  await rm(root, { recursive: true, force: true });
});

describe('settleAfterPass (ids after the real pass of check / run)', () => {
  it('evaluates nothing again when an edit does not change the ids', async () => {
    register('/src/a.se.ts', 'ns:a');
    await settleAfterPass(async () => undefined); // first run writes the file
    setEntryInputs('/src/importer.se.ts', [getIdsFilePath()]);

    const reevaluate = vi.fn(async () => undefined);
    register('/src/a.se.ts', 'ns:a'); // edited, same ids
    const again = await settleAfterPass(reevaluate);

    expect(reevaluate).not.toHaveBeenCalled();
    expect(again).toEqual([]);
  });

  it('re-evaluates only the importers of the ids when an id changed', async () => {
    register('/src/a.se.ts', 'ns:a');
    await settleAfterPass(async () => undefined);
    setEntryInputs('/src/importer.se.ts', ['/src/helper.ts', getIdsFilePath()]);
    setEntryInputs('/src/plain.se.ts', ['/src/helper.ts']);

    const reevaluate = vi.fn(async () => undefined);
    register('/src/a.se.ts', 'ns:renamed'); // the importer saw the old id
    const again = await settleAfterPass(reevaluate);

    expect(reevaluate).toHaveBeenCalledTimes(1);
    expect(reevaluate).toHaveBeenCalledWith([resolve('/src/importer.se.ts')]);
    expect(again).toEqual([resolve('/src/importer.se.ts')]);
  });

  it('is bounded when the ids keep changing', async () => {
    register('/src/a.se.ts', 'ns:a');
    await settleAfterPass(async () => undefined);
    setEntryInputs('/src/importer.se.ts', [getIdsFilePath()]);

    let n = 0;
    const reevaluate = vi.fn(async () => {
      register('/src/a.se.ts', `ns:loop_${++n}`);
    });
    register('/src/a.se.ts', 'ns:first');
    await settleAfterPass(reevaluate);

    expect(reevaluate).toHaveBeenCalledTimes(2);
  });
});

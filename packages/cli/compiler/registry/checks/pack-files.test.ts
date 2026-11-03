import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterAll, describe, expect, it } from 'vitest';

import {
  ContentDiagnosticRecord,
  setContentDiagnosticSink,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { createBehaviorPackManifestTemplate } from '../../../scaffold/templates/behavior-pack-manifest';
import { createManifestUuids } from '../../../scaffold/utils/manifest-uuids';
import type { RegistryIndex } from '../project-registry';
import { checkManifestScriptEntry, menuGroupCheck } from './pack-files';

const bp = mkdtempSync(join(tmpdir(), 'ferolyte-manifest-check-'));
afterAll(() => rmSync(bp, { recursive: true, force: true }));

const collect = (run: () => void): ContentDiagnosticRecord[] => {
  const records: ContentDiagnosticRecord[] = [];
  setContentDiagnosticSink((record) => records.push(record), { silent: true });
  try {
    run();
  } finally {
    setContentDiagnosticSink(undefined);
  }

  return records;
};

const manifest = (entry: string) => ({
  format_version: 2,
  modules: [
    { type: 'data', uuid: 'a', version: [1, 0, 0] },
    { type: 'script', language: 'javascript', uuid: 'b', version: [1, 0, 0], entry },
  ],
});

const check = (value: unknown, hasScriptEntry = true) =>
  collect(() =>
    checkManifestScriptEntry(join(bp, 'manifest.json'), value, {
      namespace: 'cool_addon',
      inputBehaviorPack: bp,
      hasScriptEntry,
    }),
  );

describe('manifest script entry check', () => {
  it('reports an entry that differs from the bundle path, naming both paths', () => {
    const records = check(manifest('scripts/cool/index.js'));

    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      contentType: 'manifest',
      fieldPath: 'modules[1].entry',
      severity: 'error',
    });
    expect(records[0].message).toContain('"scripts/cool/index.js"');
    expect(records[0].message).toContain('"scripts/cool/addon/index.js"');
  });

  it('accepts the bundle path', () => {
    expect(check(manifest('scripts/cool/addon/index.js'))).toEqual([]);
    expect(check(manifest('./scripts\\cool\\addon\\index.js'))).toEqual([]);
  });

  it('accepts a hand-written script file of the pack (warns when a bundle is built too)', () => {
    mkdirSync(join(bp, 'scripts'), { recursive: true });
    writeFileSync(join(bp, 'scripts', 'main.js'), '');

    expect(check(manifest('scripts/main.js'), false)).toEqual([]);
    expect(check(manifest('scripts/main.js'), true)).toMatchObject([{ severity: 'warning' }]);
  });

  it('keeps the manifest written by `ferolyte init` clean', () => {
    const written = JSON.parse(
      createBehaviorPackManifestTemplate({
        uuids: createManifestUuids(),
        namespace: 'cool_addon',
        minEngineVersion: [1, 21, 80],
        minecraftVersions: {
          server: '2.11.0',
          serverUi: '2.3.0',
          vanillaData: '1.26.60',
          debugUtilities: '1.0.0-beta',
        },
      }),
    );

    expect(check(written)).toEqual([]);
  });
});

describe('menu group check (plain JSON items and blocks)', () => {
  const index = (group: string, source = 'BP/items/a.json') =>
    ({
      documents: [
        {
          source,
          kind: 'item',
          json: { 'minecraft:item': { description: { menu_category: { category: 'items', group } } } },
        },
      ],
    }) as unknown as RegistryIndex;

  it('reports a group without a namespace', () => {
    const records = collect(() => menuGroupCheck(index('itemGroup.name.sword')));

    expect(records).toMatchObject([
      { severity: 'error', fieldPath: 'description.menu_category.group' },
    ]);
  });

  it('accepts namespaced groups and ignores built content', () => {
    expect(collect(() => menuGroupCheck(index('minecraft:itemGroup.name.sword')))).toEqual([]);
    expect(collect(() => menuGroupCheck(index('itemGroup.name.sword', 'a.item.ts')))).toEqual([]);
  });
});

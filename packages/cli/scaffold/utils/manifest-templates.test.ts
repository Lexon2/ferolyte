import { describe, expect, it } from 'vitest';

import { createBehaviorPackManifestTemplate } from '../templates/behavior-pack-manifest';
import { createResourcePackManifestTemplate } from '../templates/resource-pack-manifest';
import { createManifestUuids } from './manifest-uuids';

const minecraftVersions = {
  server: '2.7.0',
  serverUi: '2.0.0',
  vanillaData: '1.26.20',
  debugUtilities: '1.0.0-beta',
};

describe('manifest templates', () => {
  it('wires BP and RP header UUIDs as cross-dependencies', () => {
    const uuids = createManifestUuids();
    const minEngineVersion: [number, number, number] = [1, 21, 80];

    const behaviorManifest = JSON.parse(
      createBehaviorPackManifestTemplate({
        uuids,
        namespace: 'my_addon',
        minEngineVersion,
        minecraftVersions,
      }),
    );

    const resourceManifest = JSON.parse(
      createResourcePackManifestTemplate({ uuids, minEngineVersion }),
    );

    expect(behaviorManifest.dependencies[0].uuid).toBe(uuids.resourcePackHeader);
    expect(resourceManifest.dependencies[0].uuid).toBe(uuids.behaviorPackHeader);
    expect(behaviorManifest.modules[1].entry).toBe('scripts/my/addon/index.js');
    expect(behaviorManifest.dependencies[1].version).toBe('2.7.0');
    expect(behaviorManifest.dependencies[2].version).toBe('2.0.0');
  });
});

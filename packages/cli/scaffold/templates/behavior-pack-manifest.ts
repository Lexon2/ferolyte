import { createManifestScriptEntry } from '../../compiler/utils/namespace-path';
import { ManifestUuids } from '../utils/manifest-uuids';
import { MinecraftPackageVersions } from '../utils/resolve-minecraft-versions';

export interface BehaviorPackManifestInput {
  uuids: ManifestUuids;
  namespace: string;
  minEngineVersion: [number, number, number];
  minecraftVersions: MinecraftPackageVersions;
}

export const createBehaviorPackManifestTemplate = ({
  uuids,
  namespace,
  minEngineVersion,
  minecraftVersions,
}: BehaviorPackManifestInput): string => {
  const manifest = {
    format_version: 2,
    header: {
      name: 'pack.name',
      description: 'pack.description',
      uuid: uuids.behaviorPackHeader,
      version: [1, 0, 0],
      min_engine_version: minEngineVersion,
    },
    modules: [
      {
        type: 'data',
        uuid: uuids.behaviorPackDataModule,
        version: [1, 0, 0],
      },
      {
        type: 'script',
        uuid: uuids.behaviorPackScriptModule,
        description: 'Artifex script resources',
        language: 'javascript',
        version: [1, 0, 0],
        entry: createManifestScriptEntry(namespace),
      },
    ],
    dependencies: [
      {
        version: [1, 0, 0],
        uuid: uuids.resourcePackHeader,
      },
      {
        module_name: '@minecraft/server',
        version: minecraftVersions.server,
      },
      {
        module_name: '@minecraft/server-ui',
        version: minecraftVersions.serverUi,
      },
      {
        module_name: '@minecraft/debug-utilities',
        version: minecraftVersions.debugUtilities,
      },
    ],
  };

  return `${JSON.stringify(manifest, null, 2)}\n`;
};

import { ManifestUuids } from '../utils/manifest-uuids';

export interface ResourcePackManifestInput {
  uuids: ManifestUuids;
  minEngineVersion: [number, number, number];
}

export const createResourcePackManifestTemplate = ({
  uuids,
  minEngineVersion,
}: ResourcePackManifestInput): string => {
  const manifest = {
    format_version: 2,
    header: {
      name: 'pack.name',
      description: 'pack.description',
      uuid: uuids.resourcePackHeader,
      version: [1, 0, 0],
      min_engine_version: minEngineVersion,
    },
    modules: [
      {
        type: 'resources',
        uuid: uuids.resourcePackModule,
        version: [1, 0, 0],
      },
    ],
    dependencies: [
      {
        version: [1, 0, 0],
        uuid: uuids.behaviorPackHeader,
      },
    ],
  };

  return `${JSON.stringify(manifest, null, 2)}\n`;
};

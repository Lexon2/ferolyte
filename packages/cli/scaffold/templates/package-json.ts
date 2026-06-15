import { MinecraftPackageVersions } from '../utils/resolve-minecraft-versions';

export interface PackageJsonTemplateInput {
  slug: string;
  cliVersion: string;
  minecraftVersions: MinecraftPackageVersions;
}

export const createPackageJsonTemplate = ({
  slug,
  cliVersion,
  minecraftVersions,
}: PackageJsonTemplateInput): string => {
  const manifest = {
    name: slug,
    private: true,
    type: 'module',
    scripts: {
      build: 'ferolyte run',
      dev: 'ferolyte watch development',
    },
    dependencies: {
      '@minecraft/server': `^${minecraftVersions.server}`,
      '@minecraft/server-ui': minecraftVersions.serverUi,
      '@minecraft/vanilla-data': `^${minecraftVersions.vanillaData}`,
    },
    devDependencies: {
      '@ferolyte/cli': `^${cliVersion}`,
      typescript: '^5.3.3',
    },
  };

  return `${JSON.stringify(manifest, null, 2)}\n`;
};

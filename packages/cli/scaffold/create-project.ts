import { access } from 'fs/promises';
import { join } from 'path';

import { writeFileByPath } from '../compiler/content/utils/write-file-by-path';
import { createArtifexConfigTemplate } from './templates/artifex-config';
import { createBehaviorPackManifestTemplate } from './templates/behavior-pack-manifest';
import { createGitignoreTemplate } from './templates/gitignore';
import { createMainScriptTemplate } from './templates/main-script';
import { createPackageJsonTemplate } from './templates/package-json';
import { createResourcePackManifestTemplate } from './templates/resource-pack-manifest';
import {
  createLangTemplate,
  createLanguagesJsonTemplate,
} from './templates/texts';
import {
  createTsconfigScriptsTemplate,
  createTsconfigTemplate,
} from './templates/tsconfig';
import { createManifestUuids } from './utils/manifest-uuids';
import {
  toDisplayName,
  toNamespace,
  toPathAlias,
  toSlug,
  validateAlias,
  validateProjectName,
} from './utils/normalize';
import { parseMinEngineVersion } from './utils/parse-min-engine-version';
import { resolveMinecraftVersions } from './utils/resolve-minecraft-versions';

export interface CreateProjectInput {
  projectName: string;
  alias: string;
  cwd?: string;
  cliVersion: string;
  minGameVersion?: string;
}

export interface CreateProjectResult {
  projectDir: string;
  slug: string;
  alias: string;
  namespace: string;
}

const assertDirectoryDoesNotExist = async (projectDir: string): Promise<void> => {
  try {
    await access(projectDir);
    throw new Error(`Directory "${projectDir}" already exists.`);
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      throw error;
    }
  }
};

export const createProject = async ({
  projectName,
  alias,
  cwd = process.cwd(),
  cliVersion,
  minGameVersion = '1.21.80',
}: CreateProjectInput): Promise<CreateProjectResult> => {
  const slug = validateProjectName(projectName);
  validateAlias(alias);

  const displayName = toDisplayName(projectName);
  const namespace = toNamespace(projectName);
  const pathAlias = toPathAlias(slug);
  const projectDir = join(cwd, slug);

  await assertDirectoryDoesNotExist(projectDir);

  const uuids = createManifestUuids();
  const minecraftVersions = await resolveMinecraftVersions();
  const minEngineVersion = parseMinEngineVersion(minGameVersion);

  const files: Array<[string, string]> = [
    ['artifex.config.mts', createArtifexConfigTemplate({ alias, namespace })],
    [
      'package.json',
      createPackageJsonTemplate({ slug, cliVersion, minecraftVersions }),
    ],
    ['tsconfig.json', createTsconfigTemplate({ pathAlias })],
    ['tsconfig.scripts.json', createTsconfigScriptsTemplate({ pathAlias })],
    ['.gitignore', createGitignoreTemplate()],
    [
      'packs/BP/manifest.json',
      createBehaviorPackManifestTemplate({
        uuids,
        namespace,
        minEngineVersion,
        minecraftVersions,
      }),
    ],
    [
      'packs/RP/manifest.json',
      createResourcePackManifestTemplate({ uuids, minEngineVersion }),
    ],
    ['packs/BP/texts/languages.json', createLanguagesJsonTemplate()],
    ['packs/RP/texts/languages.json', createLanguagesJsonTemplate()],
    [
      'packs/BP/texts/en_US.lang',
      createLangTemplate({ displayName }),
    ],
    [
      'packs/RP/texts/en_US.lang',
      createLangTemplate({ displayName }),
    ],
    [
      'packs/scripts/main.ts',
      createMainScriptTemplate({ displayName }),
    ],
  ];

  for (const [relativePath, content] of files) {
    await writeFileByPath(join(projectDir, relativePath), content);
  }

  return { projectDir, slug, alias, namespace };
};

import { readFile } from 'fs/promises';
import { parse as parseJsonc } from 'jsonc-parser';
import { join } from 'path';

import { BUILD_CONTEXT } from '../build-context';
import { ArtifexProfileConfig, ArtifexPackOutput } from './interfaces/config';
import { getMinecraftDirectory } from './utils/get-minecraft-directory';
import { MinecraftPackType } from '@artifex/common/content/types/minecraft-pack-types';

const applyTsConfig = async (config: ArtifexProfileConfig) => {
  BUILD_CONTEXT.TS.CONFIG_PATH =
    config.tsconfig ?? join(process.cwd(), 'tsconfig.json');

  const tsconfig = await readFile(BUILD_CONTEXT.TS.CONFIG_PATH, 'utf8');
  const parsed = parseJsonc(tsconfig);

  if (parsed.compilerOptions.paths) {
    for (const alias in parsed.compilerOptions.paths) {
      BUILD_CONTEXT.TS.ALIASES[alias] = parsed.compilerOptions.paths[alias][0];
    }
  }
};

export const applyConfig = async (config: ArtifexProfileConfig) => {
  const { packs, scripts } = config;
  const { alias, output, minGameVersion, input, namespace } = packs;

  await applyTsConfig(config);

  const currentWorkingDirectory = process.cwd();

  const createPackPath = (alias: string, type: MinecraftPackType) =>
    `${alias.toUpperCase()}_${type}`;

  const convertPackTypeToMinecraftPackType = (type: MinecraftPackType) =>
    type === 'BP' ? 'behavior_packs' : 'resource_packs';

  const outputPathFactory: Record<
    ArtifexPackOutput,
    (alias: string, type: MinecraftPackType) => string
  > = {
    /**
     * The output path for the pack in the Minecraft directory.
     */
    minecraft: (alias: string, type: MinecraftPackType) =>
      join(
        getMinecraftDirectory(),
        convertPackTypeToMinecraftPackType(type),
        createPackPath(alias, type),
      ),
    /**
     * The output path for the pack in the Minecraft development directory.
     */
    'minecraft-dev': (alias: string, type: MinecraftPackType) =>
      join(
        getMinecraftDirectory(),
        `development_${convertPackTypeToMinecraftPackType(type)}`,
        createPackPath(alias, type),
      ),
    /**
     * The output path for the pack in the Minecraft preview directory.
     */
    'minecraft-preview': (alias: string, type: MinecraftPackType) =>
      join(
        getMinecraftDirectory(true),
        `${convertPackTypeToMinecraftPackType(type)}`,
        createPackPath(alias, type),
      ),
    /**
     * The output path for the pack in the Minecraft preview development directory.
     */
    'minecraft-preview-dev': (alias: string, type: MinecraftPackType) =>
      join(
        getMinecraftDirectory(true),
        `development_${convertPackTypeToMinecraftPackType(type)}`,
        createPackPath(alias, type),
      ),
    /**
     * The output path for the pack in the build directory.
     */
    build: (alias: string, type: MinecraftPackType) =>
      join(currentWorkingDirectory, 'build', createPackPath(alias, type)),
  };

  const outputPath = outputPathFactory[output ?? 'minecraft'];
  if (!outputPath && output !== 'custom') {
    throw new Error(`Invalid output type: ${output}`);
  }

  if (output === 'custom') {
    BUILD_CONTEXT.PACKS.OUTPUT_BEHAVIOR_PACK_PATH = join(
      output,
      createPackPath(alias, 'BP'),
    );
    BUILD_CONTEXT.PACKS.OUTPUT_RESOURCE_PACK_PATH = join(
      output,
      createPackPath(alias, 'RP'),
    );
  } else {
    BUILD_CONTEXT.PACKS.OUTPUT_NAMESPACE_PATH = outputPath(alias, 'BP');
    BUILD_CONTEXT.PACKS.OUTPUT_BEHAVIOR_PACK_PATH = outputPath(alias, 'BP');
    BUILD_CONTEXT.PACKS.OUTPUT_RESOURCE_PACK_PATH = outputPath(alias, 'RP');
  }

  // @TODO: Add namespace validation
  const namespacePath = namespace.toLowerCase().split('_').join('\\');
  BUILD_CONTEXT.PACKS.OUTPUT_NAMESPACE_PATH = namespacePath;

  BUILD_CONTEXT.PACKS.SCRIPT_ENTRY_PATH = scripts?.entry
    ? join(currentWorkingDirectory, scripts.entry)
    : join(currentWorkingDirectory, 'scripts', 'main.ts');
  BUILD_CONTEXT.PACKS.SCRIPT_MINIFY = scripts?.minify ?? false;
  BUILD_CONTEXT.PACKS.PACK_ALIAS = alias;
  BUILD_CONTEXT.PACKS.MINIFY_JSON = packs.minifyJSON ?? false;
  BUILD_CONTEXT.PACKS.ARCHIVE = packs.archive ?? false;

  const inputPath = packs.input
    ? join(currentWorkingDirectory, packs.input)
    : join(currentWorkingDirectory, 'packs');

  BUILD_CONTEXT.PACKS.INPUT_BASE_PATH = inputPath;
  BUILD_CONTEXT.PACKS.INPUT_BEHAVIOR_PACK_PATH = join(inputPath, 'BP');
  BUILD_CONTEXT.PACKS.INPUT_RESOURCE_PACK_PATH = join(inputPath, 'RP');

  BUILD_CONTEXT.PACKS.MIN_GAME_VERSION = minGameVersion ?? '1.21.80';

  BUILD_CONTEXT.PACKS.CACHE_PATH = join(
    currentWorkingDirectory,
    '.artifex/cache',
  );
};

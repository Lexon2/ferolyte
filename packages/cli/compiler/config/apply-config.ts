import { readFile } from 'fs/promises';
import { parse as parseJsonc } from 'jsonc-parser';
import { join } from 'path';

import { BUILD_CONTEXT } from '../build-context';
import { namespaceToPath } from '../utils/namespace-path';
import { FerolyteProfileConfig, FerolytePackOutput } from './interfaces/config';
import { getMinecraftDirectory } from './utils/get-minecraft-directory';
import { MinecraftPackType } from '@ferolyte/common/content/types/minecraft-pack-types';
import { buildContentSuffixRegistry } from '../content/utils/content-suffix-registry';

const applyTsConfig = async (config: FerolyteProfileConfig) => {
  BUILD_CONTEXT.TS.CONFIG_PATH =
    config.tsconfig ?? join(process.cwd(), 'tsconfig.json');

  const tsconfig = await readFile(BUILD_CONTEXT.TS.CONFIG_PATH, 'utf8');
  const parsed = parseJsonc(tsconfig);

  if (parsed.compilerOptions.paths) {
    for (const alias in parsed.compilerOptions.paths) {
      BUILD_CONTEXT.TS.ALIASES[alias] = parsed.compilerOptions.paths[alias][0];
    }
  }

  // Generated typed ids: works without a tsconfig entry (the editor needs one).
  BUILD_CONTEXT.TS.ALIASES['@ferolyte/ids'] ??= join(
    process.cwd(),
    '.ferolyte',
    'types',
    'ids.ts',
  );
};

export const applyConfig = async (config: FerolyteProfileConfig) => {
  const { packs, scripts, server } = config;
  const { alias, output, minGameVersion, input, namespace } = packs;

  await applyTsConfig(config);

  const currentWorkingDirectory = process.cwd();

  const createPackPath = (alias: string, type: MinecraftPackType) =>
    `${alias.toUpperCase()}_${type}`;

  const convertPackTypeToMinecraftPackType = (type: MinecraftPackType) =>
    type === 'BP' ? 'behavior_packs' : 'resource_packs';

  const outputPathFactory: Record<
    FerolytePackOutput,
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

  const outputPath = outputPathFactory[output ?? 'minecraft-dev'];
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
  BUILD_CONTEXT.PACKS.OUTPUT_NAMESPACE_PATH = namespaceToPath(namespace, '\\');

  BUILD_CONTEXT.PACKS.SCRIPT_ENTRY_PATH = scripts?.entry
    ? join(currentWorkingDirectory, scripts.entry)
    : join(currentWorkingDirectory, 'packs', 'scripts', 'main.ts');
  BUILD_CONTEXT.PACKS.SCRIPT_MINIFY = scripts?.minify ?? false;
  BUILD_CONTEXT.SERVER.PORT = server?.port ?? 8080;
  BUILD_CONTEXT.SERVER.HTTP = server?.http
    ? { port: server.http.port, host: server.http.host ?? '127.0.0.1' }
    : false;
  BUILD_CONTEXT.SERVER.RELOAD_ON_PACK_CHANGE =
    server?.reloadOnPackChange ?? false;
  BUILD_CONTEXT.SERVER.CLIENT_POLICY = server?.clientPolicy ?? 'newest';
  BUILD_CONTEXT.SERVER.COMMAND_VERSION = server?.commandVersion ?? 17039360;
  BUILD_CONTEXT.PACKS.PACK_ALIAS = alias;
  BUILD_CONTEXT.PACKS.NAMESPACE = namespace;
  BUILD_CONTEXT.PACKS.MINIFY_JSON = packs.minifyJSON ?? false;
  BUILD_CONTEXT.PACKS.ARCHIVE = packs.archive ?? false;

  const inputPath = packs.input
    ? join(currentWorkingDirectory, packs.input)
    : join(currentWorkingDirectory, 'packs');

  BUILD_CONTEXT.PACKS.INPUT_BASE_PATH = inputPath;
  BUILD_CONTEXT.PACKS.INPUT_BEHAVIOR_PACK_PATH = join(inputPath, 'BP');
  BUILD_CONTEXT.PACKS.INPUT_RESOURCE_PACK_PATH = join(inputPath, 'RP');

  BUILD_CONTEXT.PACKS.MIN_GAME_VERSION = minGameVersion ?? '1.26.20';

  BUILD_CONTEXT.PACKS.CACHE_PATH = join(
    currentWorkingDirectory,
    '.ferolyte/cache',
  );

  BUILD_CONTEXT.PACKS.LANG.DEFAULT_LOCALE = packs.lang?.defaultLocale ?? 'en_US';
  BUILD_CONTEXT.PACKS.LANG.LOCALES = packs.lang?.locales ?? [];

  BUILD_CONTEXT.PACKS.CONTENT_SUFFIX_REGISTRY = buildContentSuffixRegistry(
    packs.contentSuffixes,
  );
};

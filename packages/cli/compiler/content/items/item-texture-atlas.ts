import { access, readFile } from 'fs/promises';
import { join } from 'path';

import { BUILD_CONTEXT } from '../../build-context';
import { serializeJson } from '../utils/serialize-json';
import { writeWithPlugins } from '../../plugins/write-with-plugins';

export interface ItemTextureAtlasDocument {
  resource_pack_name: string;
  texture_name: string;
  texture_data: Record<string, { textures: string }>;
}

const ITEM_TEXTURE_RELATIVE_PATH = join('textures', 'item_texture.json');
const registry = new Map<string, string>();

const getInputItemTexturePath = (basePath: string): string =>
  join(basePath, ITEM_TEXTURE_RELATIVE_PATH);

const getOutputItemTexturePath = (): string =>
  join(
    BUILD_CONTEXT.PACKS.OUTPUT_RESOURCE_PACK_PATH,
    ITEM_TEXTURE_RELATIVE_PATH,
  );

const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

const readJsonFile = async (
  filePath: string,
): Promise<ItemTextureAtlasDocument | undefined> => {
  if (!(await fileExists(filePath))) {
    return undefined;
  }

  const content = await readFile(filePath, 'utf-8');
  return JSON.parse(content) as ItemTextureAtlasDocument;
};

const createDefaultAtlas = (): ItemTextureAtlasDocument => ({
  resource_pack_name: BUILD_CONTEXT.PACKS.NAMESPACE,
  texture_name: 'atlas.items',
  texture_data: {},
});

export const registerItemTexture = (key: string, textures: string): void => {
  registry.set(key, textures);
};

export const clearItemTextureRegistry = (): void => {
  registry.clear();
};

export const loadItemTextureBase = async (options?: {
  preferOutput?: boolean;
}): Promise<ItemTextureAtlasDocument> => {
  const { INPUT_RESOURCE_PACK_PATH, INPUT_BASE_PATH } = BUILD_CONTEXT.PACKS;

  if (options?.preferOutput) {
    const outputAtlas = await readJsonFile(getOutputItemTexturePath());
    if (outputAtlas !== undefined) {
      return outputAtlas;
    }
  }

  const resourcePackInput = await readJsonFile(
    getInputItemTexturePath(INPUT_RESOURCE_PACK_PATH),
  );
  if (resourcePackInput !== undefined) {
    return resourcePackInput;
  }

  const baseInput = await readJsonFile(
    getInputItemTexturePath(INPUT_BASE_PATH),
  );
  if (baseInput !== undefined) {
    return baseInput;
  }

  return createDefaultAtlas();
};

export const flushItemTextures = async (options?: {
  preferOutput?: boolean;
}): Promise<string | undefined> => {
  if (registry.size === 0) {
    return undefined;
  }

  const base = await loadItemTextureBase(options);
  base.texture_data = base.texture_data ?? {};

  for (const [key, textures] of registry) {
    base.texture_data[key] = { textures };
  }

  const outputPath = getOutputItemTexturePath();
  const sourcePath = getInputItemTexturePath(
    BUILD_CONTEXT.PACKS.INPUT_RESOURCE_PACK_PATH,
  );
  const jsonString = serializeJson(base);

  const writeResult = await writeWithPlugins(
    sourcePath,
    outputPath,
    jsonString,
    'content',
    'utf-8',
  );

  registry.clear();

  if (!writeResult.written) {
    return undefined;
  }

  return writeResult.destinationPath;
};

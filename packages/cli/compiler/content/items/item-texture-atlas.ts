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

export interface ItemTextureEntry {
  key: string;
  textures: string;
}

const ITEM_TEXTURE_RELATIVE_PATH = join('textures', 'item_texture.json');
const texturesBySource = new Map<string, Map<string, string>>();

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

export const setSourceItemTextures = (
  sourcePath: string,
  entries: readonly ItemTextureEntry[],
): void => {
  const sourceTextures = new Map<string, string>();

  for (const entry of entries) {
    sourceTextures.set(entry.key, entry.textures);
  }

  texturesBySource.set(sourcePath, sourceTextures);
};

export const removeSourceItemTextures = (sourcePath: string): void => {
  texturesBySource.delete(sourcePath);
};

export const clearAllSourceItemTextures = (): void => {
  texturesBySource.clear();
};

export const loadItemTextureBase = async (): Promise<ItemTextureAtlasDocument> => {
  const { INPUT_RESOURCE_PACK_PATH, INPUT_BASE_PATH } = BUILD_CONTEXT.PACKS;

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
  force?: boolean;
}): Promise<string | undefined> => {
  if (texturesBySource.size === 0 && !options?.force) {
    return undefined;
  }

  const base = await loadItemTextureBase();
  base.texture_data = { ...(base.texture_data ?? {}) };

  for (const sourceTextures of texturesBySource.values()) {
    for (const [key, textures] of sourceTextures) {
      base.texture_data[key] = { textures };
    }
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

  if (!writeResult.written) {
    return undefined;
  }

  return writeResult.destinationPath;
};

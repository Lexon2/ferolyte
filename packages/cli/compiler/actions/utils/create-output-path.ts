import { basename, dirname, join, relative } from 'path';

import { BUILD_CONTEXT } from '../../build-context';

const EXCLUDED_FILES: Set<string> = new Set([
  'manifest.json',
  'pack_icon.png',
  'blocks.json',
  'item_texture.json',
  'terrain_texture.json',
  'biome_definitions.json',
  'flipbook_texture.json',
  'sound_definitions.json',
  'sounds.json',
  'languages.json',
  'tick.json',
]);

function shouldAddNamespace(filePath: string) {
  const isExcluded = EXCLUDED_FILES.has(filePath);
  if (isExcluded) {
    return false;
  }

  const isUi = filePath.includes('RP/ui');
  if (isUi) {
    return true;
  }

  const isLang = filePath.endsWith('.lang');
  if (isLang) {
    return false;
  }

  const isMcStructure = filePath.endsWith('.mcstructure');
  if (isMcStructure) {
    return false;
  }

  const isMcFunction = filePath.endsWith('.mcfunction');
  if (isMcFunction) {
    return false;
  }

  const isMaterial = filePath.endsWith('.material');
  if (isMaterial) {
    return false;
  }

  const isTexture = filePath.includes('textures');
  if (isTexture) {
    return false;
  }

  return true;
}

export const createPacksOutputPathFromInputPath = (filePath: string) => {
  const {
    OUTPUT_BEHAVIOR_PACK_PATH,
    OUTPUT_RESOURCE_PACK_PATH,
    OUTPUT_NAMESPACE_PATH,
    INPUT_BASE_PATH,
  } = BUILD_CONTEXT.PACKS;

  const relativePath = relative(INPUT_BASE_PATH, filePath);
  const fileName = basename(filePath);
  let prePath: string = '';

  if (relativePath.startsWith('BP')) {
    const dir = dirname(relative('BP', relativePath));

    if (!shouldAddNamespace(fileName) || dir.includes(OUTPUT_NAMESPACE_PATH)) {
      prePath = join(OUTPUT_BEHAVIOR_PACK_PATH, dir);
    } else {
      // prePath = join(OUTPUT_BEHAVIOR_PACK_PATH, dir, OUTPUT_NAMESPACE_PATH);
      prePath = join(OUTPUT_BEHAVIOR_PACK_PATH, dir);
    }
  } else if (relativePath.startsWith('RP')) {
    const dir = dirname(relative('RP', relativePath));

    if (!shouldAddNamespace(fileName) || dir.includes(OUTPUT_NAMESPACE_PATH)) {
      prePath = join(OUTPUT_RESOURCE_PACK_PATH, dir);
    } else {
      // prePath = join(OUTPUT_RESOURCE_PACK_PATH, dir, OUTPUT_NAMESPACE_PATH);
      prePath = join(OUTPUT_RESOURCE_PACK_PATH, dir);
    }
  } else {
    return;
  }

  return join(prePath, fileName);
};

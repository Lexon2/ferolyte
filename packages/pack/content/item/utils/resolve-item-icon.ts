export interface ItemIconPackConfig {
  namespace: string;
}

export interface ItemTextureEntry {
  key: string;
  textures: string;
}

export interface ItemIconResolution {
  textureEntries: ItemTextureEntry[];
  iconTextures: Record<string, string>;
}

type IconTextures = {
  default: string;
  [key: string]: string;
};

export type ItemIconOptions =
  | string
  | {
      textures: IconTextures;
    };

export const normalizeTexturePath = (path: string): string =>
  path.endsWith('.png') ? path.slice(0, -4) : path;

export const createDefaultItemTexturePath = (
  identifier: string,
  namespace: string,
): string => {
  const namePart = identifier.includes(':')
    ? identifier.split(':')[1]
    : identifier;
  const namespacePath = namespace.toLowerCase().split('_').join('/');

  return `textures/${namespacePath}/items/${namePart}`;
};

const resolveTexturePath = (
  value: string,
  identifier: string,
  namespace: string,
): string => {
  if (value.startsWith('textures/')) {
    return normalizeTexturePath(value);
  }

  if (value === identifier) {
    return createDefaultItemTexturePath(identifier, namespace);
  }

  return normalizeTexturePath(value);
};

const textureKeyForVariant = (identifier: string, variant: string): string =>
  variant === 'default' ? identifier : `${identifier}_${variant}`;

export const resolveItemIcon = (
  icon: ItemIconOptions,
  identifier: string,
  packConfig: ItemIconPackConfig,
): ItemIconResolution | undefined => {
  if (typeof icon === 'string') {
    const texturePath = resolveTexturePath(
      icon,
      identifier,
      packConfig.namespace,
    );

    return {
      textureEntries: [{ key: identifier, textures: texturePath }],
      iconTextures: { default: identifier },
    };
  }

  if (typeof icon === 'object' && icon.textures) {
    const textureEntries: ItemTextureEntry[] = [];
    const iconTextures: Record<string, string> = {};

    for (const variant in icon.textures) {
      const value = icon.textures[variant];
      const textureKey = textureKeyForVariant(identifier, variant);
      const texturePath = resolveTexturePath(
        value,
        identifier,
        packConfig.namespace,
      );

      textureEntries.push({ key: textureKey, textures: texturePath });
      iconTextures[variant] = textureKey;
    }

    return { textureEntries, iconTextures };
  }

  return undefined;
};

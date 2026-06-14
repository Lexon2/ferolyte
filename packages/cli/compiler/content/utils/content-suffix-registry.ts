import { basename, join } from 'path';

import {
  CONTENT_METADATA,
  ContentMetadata,
} from '@artifex/common/content/metadata';
import {
  ArtifexContentSuffixConfig,
  ArtifexContentTypeKey,
} from '../../config/interfaces/config';
import { BUILD_CONTEXT } from '../../build-context';
import { formatFileName } from './format-file-name';

const SUFFIX_PATTERN = /^[a-z0-9._-]+$/;

export const DEFAULT_CONTENT_SUFFIXES: Record<
  ArtifexContentTypeKey,
  string[]
> = {
  block: ['block'],
  item: ['item'],
  'server-entity': ['se'],
  'client-entity': ['ce'],
};

const CONTENT_TYPE_TO_METADATA: Record<
  ArtifexContentTypeKey,
  ContentMetadata
> = {
  block: CONTENT_METADATA.BLOCK,
  item: CONTENT_METADATA.ITEM,
  'server-entity': CONTENT_METADATA.SERVER_ENTITY,
  'client-entity': CONTENT_METADATA.CLIENT_ENTITY,
};

const CONTENT_TYPE_OUTPUT_DIRS: Record<
  ArtifexContentTypeKey,
  { pack: 'BP' | 'RP'; subdir: string }
> = {
  block: { pack: 'BP', subdir: 'blocks' },
  item: { pack: 'BP', subdir: 'items' },
  'server-entity': { pack: 'BP', subdir: 'entities' },
  'client-entity': { pack: 'RP', subdir: 'entity' },
};

interface ContentSuffixRule {
  contentType: ArtifexContentTypeKey;
  suffix: string;
  metadata: ContentMetadata;
}

export interface ResolvedContentFile {
  contentType: ArtifexContentTypeKey;
  metadata: ContentMetadata;
  inputSuffix: string;
}

export interface CreateContentOutputPathOptions {
  identifier?: string;
  contentType?: ArtifexContentTypeKey;
}

export interface ContentSuffixRegistry {
  resolveContentFile(filePath: string): ResolvedContentFile | undefined;
  isArtifexContentFile(filePath: string): boolean;
  createContentOutputPath(
    filePath: string,
    options?: CreateContentOutputPathOptions,
  ): string | undefined;
}

const normalizeSuffix = (suffix: string): string => {
  let normalized = suffix.trim();

  if (normalized.endsWith('.ts')) {
    normalized = normalized.slice(0, -3);
  }

  if (normalized.startsWith('.')) {
    normalized = normalized.slice(1);
  }

  return normalized;
};

const validateSuffix = (suffix: string, contentType: ArtifexContentTypeKey) => {
  if (suffix.length === 0) {
    throw new Error(
      `Invalid content suffix for "${contentType}": suffix must not be empty`,
    );
  }

  if (!SUFFIX_PATTERN.test(suffix)) {
    throw new Error(
      `Invalid content suffix "${suffix}" for "${contentType}": only lowercase letters, digits, ".", "_", and "-" are allowed`,
    );
  }
};

const mergeSuffixConfig = (
  config?: ArtifexContentSuffixConfig,
): Record<ArtifexContentTypeKey, string[]> => {
  const merged = { ...DEFAULT_CONTENT_SUFFIXES };

  if (!config) {
    return merged;
  }

  for (const contentType of Object.keys(
    DEFAULT_CONTENT_SUFFIXES,
  ) as ArtifexContentTypeKey[]) {
    const configured = config[contentType];
    if (configured === undefined) {
      continue;
    }

    const suffixes = Array.isArray(configured) ? configured : [configured];
    merged[contentType] = suffixes.map(normalizeSuffix);
  }

  return merged;
};

const buildRules = (
  suffixesByType: Record<ArtifexContentTypeKey, string[]>,
): ContentSuffixRule[] => {
  const rules: ContentSuffixRule[] = [];
  const seen = new Map<string, ArtifexContentTypeKey>();

  for (const contentType of Object.keys(
    suffixesByType,
  ) as ArtifexContentTypeKey[]) {
    for (const rawSuffix of suffixesByType[contentType]) {
      const suffix = normalizeSuffix(rawSuffix);
      validateSuffix(suffix, contentType);

      const previousType = seen.get(suffix);
      if (previousType !== undefined && previousType !== contentType) {
        throw new Error(
          `Duplicate content suffix "${suffix}" for types "${previousType}" and "${contentType}"`,
        );
      }

      seen.set(suffix, contentType);
      rules.push({
        contentType,
        suffix,
        metadata: CONTENT_TYPE_TO_METADATA[contentType],
      });
    }
  }

  return rules.sort((a, b) => b.suffix.length - a.suffix.length);
};

const getBaseNameFromSource = (
  filePath: string,
  inputSuffix: string,
): string => {
  const suffixWithExtension = `.${inputSuffix}.ts`;

  if (filePath.endsWith(suffixWithExtension)) {
    return basename(filePath, suffixWithExtension);
  }

  return basename(filePath, '.ts');
};

const createOutputFileName = (
  filePath: string,
  inputSuffix: string,
  identifier?: string,
): string | undefined => {
  const name = identifier
    ? identifier.split(':')[1]
    : getBaseNameFromSource(filePath, inputSuffix);

  if (name === undefined || name.length === 0) {
    return undefined;
  }

  return formatFileName(name, `.${inputSuffix}.json`);
};

export const buildContentSuffixRegistry = (
  config?: ArtifexContentSuffixConfig,
): ContentSuffixRegistry => {
  const suffixesByType = mergeSuffixConfig(config);
  const rules = buildRules(suffixesByType);

  const resolveContentFile = (
    filePath: string,
  ): ResolvedContentFile | undefined => {
    for (const rule of rules) {
      if (filePath.endsWith(`.${rule.suffix}.ts`)) {
        return {
          contentType: rule.contentType,
          metadata: rule.metadata,
          inputSuffix: rule.suffix,
        };
      }
    }

    return undefined;
  };

  const createContentOutputPath = (
    filePath: string,
    options: CreateContentOutputPathOptions = {},
  ): string | undefined => {
    let resolved = resolveContentFile(filePath);

    if (resolved === undefined && options.contentType !== undefined) {
      const inputSuffix = suffixesByType[options.contentType][0];
      resolved = {
        contentType: options.contentType,
        metadata: CONTENT_TYPE_TO_METADATA[options.contentType],
        inputSuffix,
      };
    }

    if (resolved === undefined) {
      return undefined;
    }

    const fileName = createOutputFileName(
      filePath,
      resolved.inputSuffix,
      options.identifier,
    );

    if (fileName === undefined) {
      return undefined;
    }

    const { OUTPUT_NAMESPACE_PATH, OUTPUT_BEHAVIOR_PACK_PATH, OUTPUT_RESOURCE_PACK_PATH } =
      BUILD_CONTEXT.PACKS;
    const outputDir = CONTENT_TYPE_OUTPUT_DIRS[resolved.contentType];
    const packPath =
      outputDir.pack === 'BP'
        ? OUTPUT_BEHAVIOR_PACK_PATH
        : OUTPUT_RESOURCE_PACK_PATH;

    return join(packPath, outputDir.subdir, OUTPUT_NAMESPACE_PATH, fileName);
  };

  return {
    resolveContentFile,
    isArtifexContentFile(filePath: string) {
      return resolveContentFile(filePath) !== undefined;
    },
    createContentOutputPath,
  };
};

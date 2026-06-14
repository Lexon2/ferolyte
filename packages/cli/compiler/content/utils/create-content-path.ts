import { basename, join } from 'path';

import {
  CONTENT_METADATA,
  ContentMetadata,
} from '@artifex/common/content/metadata';
import { formatFileName } from './format-file-name';
import { BUILD_CONTEXT } from '../../build-context';

const decideContentType = (filePath: string): ContentMetadata => {
  if (filePath.endsWith('.se.ts')) {
    return CONTENT_METADATA.SERVER_ENTITY;
  } else if (filePath.endsWith('.ce.ts')) {
    return CONTENT_METADATA.CLIENT_ENTITY;
  } else if (filePath.endsWith('.item.ts')) {
    return CONTENT_METADATA.ITEM;
  } else if (filePath.endsWith('.block.ts')) {
    return CONTENT_METADATA.BLOCK;
  }
  return CONTENT_METADATA.UNKNOWN;
};

export const createContentPath = (
  filePath: string,
  contentType?: ContentMetadata,
): string | undefined => {
  if (contentType === undefined) {
    contentType = decideContentType(filePath);
  }

  const createFileName = (filePath: string, suffix: string) => {
    return formatFileName(
      basename(filePath, filePath.endsWith(suffix) ? suffix : '.ts'),
      suffix + '.json',
    );
  };

  const pathGenerator: Record<ContentMetadata, () => string | undefined> = {
    [CONTENT_METADATA.SERVER_ENTITY]: () => {
      const fileName = createFileName(filePath, 'se');

      const { OUTPUT_NAMESPACE_PATH, OUTPUT_BEHAVIOR_PACK_PATH } =
        BUILD_CONTEXT.PACKS;

      return fileName
        ? join(
            OUTPUT_BEHAVIOR_PACK_PATH,
            'entities',
            OUTPUT_NAMESPACE_PATH,
            fileName,
          )
        : undefined;
    },
    [CONTENT_METADATA.CLIENT_ENTITY]: () => {
      const fileName = createFileName(filePath, 'ce');

      const { OUTPUT_NAMESPACE_PATH, OUTPUT_RESOURCE_PACK_PATH } =
        BUILD_CONTEXT.PACKS;

      return fileName
        ? join(
            OUTPUT_RESOURCE_PACK_PATH,
            'entity',
            OUTPUT_NAMESPACE_PATH,
            fileName,
          )
        : undefined;
    },
    [CONTENT_METADATA.ITEM]: () => {
      const fileName = createFileName(filePath, 'item');

      const { OUTPUT_NAMESPACE_PATH, OUTPUT_BEHAVIOR_PACK_PATH } =
        BUILD_CONTEXT.PACKS;

      return fileName
        ? join(
            OUTPUT_BEHAVIOR_PACK_PATH,
            'items',
            OUTPUT_NAMESPACE_PATH,
            fileName,
          )
        : undefined;
    },
    [CONTENT_METADATA.BLOCK]: () => {
      const fileName = createFileName(filePath, 'block');

      const { OUTPUT_NAMESPACE_PATH, OUTPUT_BEHAVIOR_PACK_PATH } =
        BUILD_CONTEXT.PACKS;

      return fileName
        ? join(
            OUTPUT_BEHAVIOR_PACK_PATH,
            'blocks',
            OUTPUT_NAMESPACE_PATH,
            fileName,
          )
        : undefined;
    },
    [CONTENT_METADATA.UNKNOWN]: () => {
      return undefined;
    },
  };

  return pathGenerator[contentType]();
};

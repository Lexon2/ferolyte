import { ContentMetadata } from '@ferolyte/common/content/metadata';

import { BUILD_CONTEXT } from '../../build-context';
import { CreateContentOutputPathOptions } from './content-suffix-registry';

export const createContentPath = (
  filePath: string,
  _contentType?: ContentMetadata,
  options?: CreateContentOutputPathOptions,
): string | undefined => {
  return BUILD_CONTEXT.PACKS.CONTENT_SUFFIX_REGISTRY.createContentOutputPath(
    filePath,
    options,
  );
};

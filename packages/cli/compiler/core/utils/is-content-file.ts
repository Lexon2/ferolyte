import { BUILD_CONTEXT } from '../../build-context';

export const isFerolyteContentFile = (filePath: string) => {
  return BUILD_CONTEXT.PACKS.CONTENT_SUFFIX_REGISTRY.isFerolyteContentFile(
    filePath,
  );
};

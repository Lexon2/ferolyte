import { BUILD_CONTEXT } from '../../build-context';

export const isArtifexContentFile = (filePath: string) => {
  return BUILD_CONTEXT.PACKS.CONTENT_SUFFIX_REGISTRY.isArtifexContentFile(
    filePath,
  );
};

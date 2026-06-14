export const isArtifexContentFile = (filePath: string) => {
  if (/\.(se.ts|item.ts|block.ts|ce.ts)$/.test(filePath)) {
    return true;
  }
  return false;
};

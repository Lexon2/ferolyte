import { extname } from 'path';

export const isEsmFile = (filePath: string) => {
  const ext = extname(filePath);
  if (/\.(mjs|mts)$/.test(ext)) {
    return true;
  }
  if (/\.(cjs|cts)/.test(ext)) {
    return false;
  }
  // package.json should be find from configPath root
  return false;
};

import { pathToFileURL } from 'node:url';

import { isEsmFile } from './is-esm-file';
import { ArtifexConfig } from '../interfaces/config';

export const importArtifexConfig = async (
  path: string,
  // cwd: string = process.cwd(),
): Promise<ArtifexConfig | undefined> => {
  if (isEsmFile(path)) {
    const url = pathToFileURL(path).href;
    const { default: config } = await import(url);

    return config;
  }
  // let result = require(path);
  // if (result && typeof result === 'object' && 'default' in result) {
  //   result = result.default || {};
  // }
  // return result;
};

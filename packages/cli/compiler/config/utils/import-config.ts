import { pathToFileURL } from 'node:url';

import { isEsmFile } from './is-esm-file';
import { FerolyteConfig } from '../interfaces/config';

export const importFerolyteConfig = async (
  path: string,
  // cwd: string = process.cwd(),
): Promise<FerolyteConfig | undefined> => {
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

import { join } from 'path';

import { Float } from '@artifex/common/content/tools/float';
import { ServerEntityBuilder } from '@artifex/pack/content/server-entity/server-entity-builder';
import { ContentBuildOptions } from '../../actions/options';
import { serializeJson } from '../utils/serialize-json';
import { writeWithPlugins } from '../../plugins/write-with-plugins';
import { createContentPath } from '../utils/create-content-path';

// TODO: Remove this once we have a better way to handle floats
const replaceArtifexFloatsInJsonString = (json: string): string => {
  return json.replace(
    /"\$artifex_float\[(\-?\d+(?:\.\d+)?)\]"/g,
    (_, num) => num,
  );
};

const replaceTrailingZeroFloats = (obj: any): void => {
  const floatify = (val: number): Float | number => {
    const str = `${val}`;
    const match = str.match(/^(-?\d+\.\d+)$/);
    if (match) {
      return new Float(val, 10);
    }

    return val;
  };

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const val = obj[i];
      if (typeof val === 'number') {
        obj[i] = floatify(val);
      } else {
        replaceTrailingZeroFloats(val);
      }
    }
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      const val = obj[key];
      if (typeof val === 'number') {
        obj[key] = floatify(val);
      } else {
        replaceTrailingZeroFloats(val);
      }
    }
  }
};

export const buildServerEntityJson = async (
  filePath: string,
  builder: ServerEntityBuilder,
  options: ContentBuildOptions = { debug: true, diagnostics: true },
): Promise<string | undefined> => {
  builder.withBuildContext({
    sourceFile: filePath,
    identifier: builder.cloneConfig().identifier,
    diagnostics: options.diagnostics,
    contentType: 'server-entity',
  });

  const json = builder.build();
  replaceTrailingZeroFloats(json);

  const jsonString = serializeJson(json);

  const identifier = builder.cloneConfig().identifier ?? '';
  const outFile = createContentPath(filePath, undefined, { identifier });
  if (identifier === undefined || outFile === undefined) {
    console.error(`Error creating content path for ${filePath}`);

    return;
  }

  const replacedJsonString = replaceArtifexFloatsInJsonString(jsonString);

  const writeResult = await writeWithPlugins(
    filePath,
    outFile,
    replacedJsonString,
    'content',
    'utf-8',
  );

  if (!writeResult.written) {
    return;
  }

  return writeResult.destinationPath;
};

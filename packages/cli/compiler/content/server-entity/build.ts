import { join } from 'path';

import { Float } from '@artifex/common/content/tools/float';
import { ServerEntityBuilder } from '@artifex/pack/content/server-entity/server-entity-builder';
import { BUILD_CONTEXT } from '../../build-context';
import { formatFileName } from '../utils/format-file-name';
import { serializeJson } from '../utils/serialize-json';
import { writeWithPlugins } from '../../plugins/write-with-plugins';
import { ContentBuildOptions } from '../../actions/options';

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
  const fileName = formatFileName(identifier.split(':')[1], '.se.json');
  if (identifier === undefined || fileName === undefined) {
    console.error(`Error creating content path for ${filePath}`);

    return;
  }

  const { OUTPUT_NAMESPACE_PATH, OUTPUT_BEHAVIOR_PACK_PATH } =
    BUILD_CONTEXT.PACKS;

  const outFile = join(
    OUTPUT_BEHAVIOR_PACK_PATH,
    'entities',
    OUTPUT_NAMESPACE_PATH,
    fileName,
  );
  if (outFile === undefined) {
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

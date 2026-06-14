import { ClientEntityBuilder } from '@artifex/pack/content/client-entity/client-entity-builder';
import { ContentBuildOptions } from '../../actions/options';
import { serializeJson } from '../utils/serialize-json';
import { writeWithPlugins } from '../../plugins/write-with-plugins';
import { createContentPath } from '../utils/create-content-path';

export const buildClientEntityJson = async (
  filePath: string,
  builder: ClientEntityBuilder,
  _options: ContentBuildOptions = { debug: true, diagnostics: true },
): Promise<string | undefined> => {
  const json = builder.build();
  const jsonString = serializeJson(json);

  const identifier = builder.cloneConfig().identifier ?? '';
  const outFile = createContentPath(filePath, undefined, { identifier });
  if (identifier === undefined || outFile === undefined) {
    console.error(`Error creating content path for ${filePath}`);

    return;
  }

  const writeResult = await writeWithPlugins(
    filePath,
    outFile,
    jsonString,
    'content',
    'utf-8',
  );

  if (!writeResult.written) {
    return;
  }

  return writeResult.destinationPath;
};

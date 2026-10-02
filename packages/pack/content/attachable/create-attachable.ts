import { deepMerge } from '@ferolyte/common/object/deep-merge';
import { AttachableBuilder, type AttachableConfig } from './attachable-builder';

/**
 * Creates an attachable (`*.att.ts` -> RP `attachables/`). Later arguments (configs or builders) are merged on top.
 * For a 1:1 mirror of the JSON file use `createAttachableDocument`.
 */
export const createAttachable = (
  config: AttachableConfig,
  ...rest: (Partial<AttachableConfig> | AttachableBuilder)[]
): AttachableBuilder => {
  let merged: any = {};
  for (const source of [config, ...rest]) {
    merged = deepMerge(
      merged,
      source instanceof AttachableBuilder ? source.cloneConfig() : source,
    );
  }

  return new AttachableBuilder(merged);
};

export const defineAttachableConfig = <C extends AttachableConfig>(config: C) =>
  config;

import { BlockConfig, BlockVersions } from './interfaces/block-config';

export const defineBlockConfig = <
  V extends BlockVersions,
  C extends BlockConfig<V> = BlockConfig<V>,
>(
  config: C,
) => config;

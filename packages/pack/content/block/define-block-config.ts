import { LooseString } from '@ferolyte/common/types';
import { BlockConfig, BlockVersions } from './interfaces/block-config';

export const defineBlockConfig = <
  V extends LooseString<BlockVersions>,
  C extends BlockConfig<V> = BlockConfig<V>,
>(
  config: C,
) => config;

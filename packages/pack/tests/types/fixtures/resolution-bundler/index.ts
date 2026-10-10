import { defineFerolyteConfig } from '@ferolyte/cli/config';
import type { FerolytePlugin } from '@ferolyte/cli/plugin';
import { createServerEntity } from '@ferolyte/pack';
import { createItem } from '@ferolyte/pack/item';

export const entity: typeof createServerEntity = createServerEntity;
export const item: typeof createItem = createItem;
export const config: typeof defineFerolyteConfig = defineFerolyteConfig;
export type Plugin = FerolytePlugin;

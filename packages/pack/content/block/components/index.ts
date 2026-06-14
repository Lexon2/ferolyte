import { createChestObstruction } from './chest-obstruction';
import { createCollisionBox } from './collision-box';
import { createConnectionRule } from './connection-rule';
import { createCraftingTable } from './crafting-table';
import { createCustomComponents } from './custom-components';
import { createDestructibleByExplosion } from './destructible-by-explosion';
import { createDestructibleByMining } from './destructible-by-mining';
import { createDestructionParticles } from './destruction-particles';
import { createEmbeddedVisual } from './embedded-visual';
import { createEntityFallOn } from './entity-fall-on';
import { createFlammable } from './flammable';
import { createFlowerPottable } from './flower-pottable';
import { createFriction } from './friction';
import { createGeometry } from './geometry';
import { createItemVisual } from './item-visual';
import { createLeashable } from './leashable';
import { createLightDampening } from './light-dampening';
import { createLightEmission } from './light-emission';
import { createLiquidDetection } from './liquid-detection';
import { createLoot } from './loot';
import { createMapColor } from './map-color';
import { createMaterialInstances } from './material-instances';
import { createMovable } from './movable';
import { createPlacementFilter } from './placement-filter';
import { createPrecipitationInteractions } from './precipitation-interactions';
import { createRandomOffset } from './random-offset';
import { createRedstoneConductivity } from './redstone-conductivity';
import { createRedstoneConsumer } from './redstone-consumer';
import { createRedstoneProducer } from './redstone-producer';
import { createReplaceable } from './replaceable';
import { createSelectionBox } from './selection-box';
import { createBlockTags } from './tags';
import { createSupport } from './support';
import { createTick } from './tick';
import { createTransformation } from './transformation';
import { createDisplayName } from './display-name';
import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';

export type BlockComponentCreator = (
  value?: unknown,
  ctx?: ContentDiagnosticContext,
) => Record<string, unknown> | undefined;

/**
 * Mapping of BlockConfig component properties to their creator functions
 */
export const blockComponentCreatorsFactory: Record<
  string,
  BlockComponentCreator
> = {
  chestObstruction: createChestObstruction,
  collisionBox: createCollisionBox,
  connectionRule: createConnectionRule,
  craftingTable: createCraftingTable,
  customComponents: createCustomComponents,
  destructibleByExplosion: createDestructibleByExplosion,
  destructibleByMining: createDestructibleByMining,
  destructionParticles: createDestructionParticles,
  displayName: createDisplayName,
  embeddedVisual: createEmbeddedVisual,
  entityFallOn: createEntityFallOn,
  flammable: createFlammable,
  flowerPottable: createFlowerPottable,
  friction: createFriction,
  geometry: createGeometry,
  itemVisual: createItemVisual,
  leashable: createLeashable,
  lightDampening: createLightDampening,
  lightEmission: createLightEmission,
  liquidDetection: createLiquidDetection,
  loot: createLoot,
  mapColor: createMapColor,
  materialInstances: createMaterialInstances,
  movable: createMovable,
  placementFilter: createPlacementFilter,
  precipitationInteractions: createPrecipitationInteractions,
  randomOffset: createRandomOffset,
  redstoneConductivity: createRedstoneConductivity,
  redstoneConsumer: createRedstoneConsumer,
  redstoneProducer: createRedstoneProducer,
  replaceable: createReplaceable,
  selectionBox: createSelectionBox,
  support: createSupport,
  tags: createBlockTags,
  tick: createTick,
  transformation: createTransformation,
};

export * from './chest-obstruction';

export * from './collision-box';

export * from './connection-rule';

export * from './crafting-table';

export * from './custom-components';

export * from './destructible-by-explosion';

export * from './destructible-by-mining';

export * from './destruction-particles';

export * from './embedded-visual';

export * from './entity-fall-on';

export * from './flammable';

export * from './flower-pottable';

export * from './friction';

export * from './geometry';

export * from './item-visual';

export * from './leashable';

export * from './light-dampening';

export * from './light-emission';

export * from './liquid-detection';

export * from './loot';

export * from './map-color';

export * from './material-instances';

export * from './movable';

export * from './placement-filter';

export * from './precipitation-interactions';

export * from './random-offset';

export * from './redstone-conductivity';

export * from './redstone-consumer';

export * from './redstone-producer';

export * from './replaceable';

export * from './selection-box';

export * from './support';

export * from './tags';

export * from './tick';

export * from './transformation';

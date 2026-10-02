export * from './item';
export * from './block';
export * from './entity';
export * from './molang';
export * from './animation';

// Names declared by both blocks and entities: the root barrel exposes the entity
// versions, the block ones stay available as aliases and via `@ferolyte/pack/block`.
export type {
  CollisionBoxComponent as BlockCollisionBoxComponent,
  LeashableComponent as BlockLeashableComponent,
  LootComponent as BlockLootComponent,
  TransformationComponent as BlockTransformationComponent,
} from './block';
export type {
  CollisionBoxComponent,
  LeashableComponent,
  LootComponent,
  TransformationComponent,
} from './entity';

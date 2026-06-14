/**
 * Possible game rule names
 */
export type GameRule =
  | 'commandBlockOutput'
  | 'commandBlocksEnabled'
  | 'doDaylightCycle'
  | 'doEntityDrops'
  | 'doFireTick'
  | 'doImmediateRespawn'
  | 'doInsomnia'
  | 'doMobLoot'
  | 'doMobSpawning'
  | 'doTileDrops'
  | 'doWeatherCycle'
  | 'drowningDamage'
  | 'fallDamage'
  | 'fireDamage'
  | 'freezeDamage'
  | 'functionCommandLimit'
  | 'keepInventory'
  | 'maxCommandChainLength'
  | 'mobGriefing'
  | 'naturalRegeneration'
  | 'pvp'
  | 'randomTickSpeed'
  | 'respawnblocksexplode'
  | 'sendCommandFeedback'
  | 'showCoordinates'
  | 'showDeathMessages'
  | 'showTags'
  | 'spawnRadius'
  | 'tntExplodes';

/**
 * List of all possible game rules
 */
export const GAME_RULES: GameRule[] = [
  'commandBlockOutput',
  'commandBlocksEnabled',
  'doDaylightCycle',
  'doEntityDrops',
  'doFireTick',
  'doImmediateRespawn',
  'doInsomnia',
  'doMobLoot',
  'doMobSpawning',
  'doTileDrops',
  'doWeatherCycle',
  'drowningDamage',
  'fallDamage',
  'fireDamage',
  'freezeDamage',
  'functionCommandLimit',
  'keepInventory',
  'maxCommandChainLength',
  'mobGriefing',
  'naturalRegeneration',
  'pvp',
  'randomTickSpeed',
  'respawnblocksexplode',
  'sendCommandFeedback',
  'showCoordinates',
  'showDeathMessages',
  'showTags',
  'spawnRadius',
  'tntExplodes'
];

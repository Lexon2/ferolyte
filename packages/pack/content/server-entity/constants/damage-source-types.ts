export type DamageSourceType =
  | 'none'
  | 'lava'
  | 'fire'
  | 'drowning'
  | 'block_explosion'
  | 'entity_explosion'
  | 'void'
  | 'suicide'
  | 'magic'
  | 'wither'
  | 'fall'
  | 'starve'
  | 'anvil'
  | 'thorns'
  | 'falling_block'
  | 'piston'
  | 'fly_into_wall'
  | 'magma'
  | 'fireworks'
  | 'lightning'
  | 'charging'
  | 'temperature'
  | 'all'
  | 'default'
  | 'sweet_berry_bush'
  | 'freezing'
  | 'stinging'
  | 'projectile'
  | 'contact'
  | 'entity_attack'
  | 'entity_sweep_attack'
  | 'projectile_attack'
  | 'soul_fire'
  | 'soul_campfire'
  | 'cramming'
  | 'player_explosion'
  | 'sonic_boom'
  | 'bleeding'
  | 'freeze'
  | 'stalactite'
  | 'stalagmite'
  | 'ram_attack'
  | 'sonic_boom'
  | 'wind_charge'
  | 'mob_attack'
  | 'mob_attack_no_aggro'
  | 'mob_projectile'
  | 'custom'
  | 'indirect_magic'
  | 'bad_respawn_point'
  | 'out_of_world'
  | 'generic'
  | 'undefined';

export const DAMAGE_SOURCE_TYPES: readonly DamageSourceType[] = [
  'none',
  'lava',
  'fire',
  'drowning',
  'block_explosion',
  'entity_explosion',
  'void',
  'suicide',
  'magic',
  'wither',
  'fall',
  'starve',
  'anvil',
  'thorns',
  'falling_block',
  'piston',
  'fly_into_wall',
  'magma',
  'fireworks',
  'lightning',
  'charging',
  'temperature',
  'all',
  'default',
  'sweet_berry_bush',
  'freezing',
  'stinging',
  'projectile',
  'contact',
  'entity_attack',
  'entity_sweep_attack',
  'projectile_attack',
  'soul_fire',
  'soul_campfire',
  'cramming',
  'player_explosion',
  'sonic_boom',
  'bleeding',
  'freeze',
  'stalactite',
  'stalagmite',
  'ram_attack',
  'sonic_boom',
  'wind_charge',
  'mob_attack',
  'mob_attack_no_aggro',
  'mob_projectile',
  'custom',
  'indirect_magic',
  'bad_respawn_point',
  'out_of_world',
  'generic',
  'undefined',
] as const;

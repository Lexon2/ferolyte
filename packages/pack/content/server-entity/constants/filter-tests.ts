export type EntityFilterTest =
  | 'actor_health'
  | 'all_slots_empty'
  | 'any_slots_empty'
  | 'bool_property'
  | 'clock_time'
  | 'distance_to_nearest_player'
  | 'enum_property'
  | 'float_property'
  | 'has_ability'
  | 'has_biome_tag'
  | 'has_component'
  | 'has_container_open'
  | 'has_damage'
  | 'has_damaged_equipment'
  | 'has_equipment'
  | 'has_item_with_component'
  | 'has_same_equipment_in_slot_as'
  | 'has_equipment_tag'
  | 'has_mob_effect'
  | 'has_nametag'
  | 'has_property'
  | 'has_ranged_weapon'
  | 'has_silk_touch'
  | 'has_tag'
  | 'has_target'
  | 'has_trade_supply'
  | 'home_distance'
  | 'hourly_clock_time'
  | 'in_block'
  | 'in_caravan'
  | 'in_clouds'
  | 'in_contact_with_water'
  | 'in_lava'
  | 'in_nether'
  | 'in_overworld'
  | 'in_water'
  | 'in_water_or_rain'
  | 'inactivity_timer'
  | 'int_property'
  | 'is_altitude'
  | 'is_avoiding_mobs'
  | 'is_biome'
  | 'is_block'
  | 'is_bound_to_creaking_heart'
  | 'is_brightness'
  | 'is_climbing'
  | 'is_color'
  | 'is_controlling_passenger_family'
  | 'is_daytime'
  | 'is_difficulty'
  | 'is_family'
  | 'is_game_rule'
  | 'is_humid'
  | 'is_immobile'
  | 'is_in_village'
  | 'is_leashed'
  | 'is_leashed_to'
  | 'is_mark_variant'
  | 'is_missing_health'
  | 'is_moving'
  | 'is_navigating'
  | 'is_owner'
  | 'is_persistent'
  | 'is_riding'
  | 'is_riding_self'
  | 'is_sitting'
  | 'is_skin_id'
  | 'is_sleeping'
  | 'is_sneak_held'
  | 'is_sneaking'
  | 'is_sprinting'
  | 'is_tamed'
  | 'is_snow_covered'
  | 'is_target'
  | 'is_temperature_type'
  | 'is_temperature_value'
  | 'is_underground'
  | 'is_underwater'
  | 'is_variant'
  | 'is_vehicle_family'
  | 'is_weather'
  | 'is_visible'
  | 'is_waterlogged'
  | 'light_level'
  | 'moon_intensity'
  | 'moon_phase'
  | 'on_ground'
  | 'on_ladder'
  | 'owner_distance'
  | 'random_chance'
  | 'rider_count'
  | 'surface_mob'
  | 'taking_fire_damage'
  | 'target_distance'
  | 'trusts'
  | 'weather'
  | 'weather_at_position'
  | 'y_rotation';

export const FILTER_TESTS: EntityFilterTest[] = [
  'actor_health',
  'all_slots_empty',
  'any_slots_empty',
  'bool_property',
  'clock_time',
  'distance_to_nearest_player',
  'enum_property',
  'float_property',
  'has_ability',
  'has_biome_tag',
  'has_component',
  'has_container_open',
  'has_damage',
  'has_damaged_equipment',
  'has_equipment',
  'has_item_with_component',
  'has_same_equipment_in_slot_as',
  'has_equipment_tag',
  'has_mob_effect',
  'has_nametag',
  'has_property',
  'has_ranged_weapon',
  'has_silk_touch',
  'has_tag',
  'has_target',
  'has_trade_supply',
  'home_distance',
  'hourly_clock_time',
  'in_block',
  'in_caravan',
  'in_clouds',
  'in_contact_with_water',
  'in_lava',
  'in_nether',
  'in_overworld',
  'in_water',
  'in_water_or_rain',
  'inactivity_timer',
  'int_property',
  'is_altitude',
  'is_avoiding_mobs',
  'is_biome',
  'is_block',
  'is_bound_to_creaking_heart',
  'is_brightness',
  'is_climbing',
  'is_color',
  'is_controlling_passenger_family',
  'is_daytime',
  'is_difficulty',
  'is_family',
  'is_game_rule',
  'is_humid',
  'is_immobile',
  'is_in_village',
  'is_leashed',
  'is_leashed_to',
  'is_mark_variant',
  'is_missing_health',
  'is_moving',
  'is_navigating',
  'is_owner',
  'is_persistent',
  'is_riding',
  'is_riding_self',
  'is_sitting',
  'is_skin_id',
  'is_sleeping',
  'is_sneak_held',
  'is_sneaking',
  'is_sprinting',
  'is_tamed',
  'is_snow_covered',
  'is_target',
  'is_temperature_type',
  'is_temperature_value',
  'is_underground',
  'is_underwater',
  'is_variant',
  'is_vehicle_family',
  'is_weather',
  'is_visible',
  'is_waterlogged',
  'light_level',
  'moon_intensity',
  'moon_phase',
  'on_ground',
  'on_ladder',
  'owner_distance',
  'random_chance',
  'rider_count',
  'surface_mob',
  'taking_fire_damage',
  'target_distance',
  'trusts',
  'weather',
  'weather_at_position',
  'y_rotation'
];

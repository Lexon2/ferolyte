import {
  ActorHealthFilter,
  AllSlotsEmptyFilter,
  AnySlotsEmptyFilter,
  BoolPropertyFilter,
  ClockTimeFilter,
  DistanceToNearestPlayerFilter,
  EnumPropertyFilter,
  FloatPropertyFilter,
  HasAbilityFilter,
  HasBiomeTagFilter,
  HasComponentFilter,
  HasContainerOpenFilter,
  HasDamageFilter,
  HasDamagedEquipmentFilter,
  HasEquipmentFilter,
  HasItemWithComponentFilter,
  HasSameEquipmentInSlotAsFilter,
  HasEquipmentTagFilter,
  HasMobEffectFilter,
  HasNametagFilter,
  HasPropertyFilter,
  HasRangedWeaponFilter,
  HasSilkTouchFilter,
  HasTagFilter,
  HasTargetFilter,
  HasTradeSupplyFilter,
  HomeDistanceFilter,
  HourlyClockTimeFilter,
  InBlockFilter,
  InCaravanFilter,
  InCloudsFilter,
  InContactWithWaterFilter,
  InLavaFilter,
  InNetherFilter,
  InOverworldFilter,
  InWaterFilter,
  InWaterOrRainFilter,
  InactivityTimerFilter,
  IntPropertyFilter,
  IsAltitudeFilter,
  IsAvoidingMobsFilter,
  IsBiomeFilter,
  IsBlockFilter,
  IsBoundToCreakingHeartFilter,
  IsBrightnessFilter,
  IsClimbingFilter,
  IsColorFilter,
  IsControllingPassengerFamilyFilter,
  IsDaytimeFilter,
  IsDifficultyFilter,
  IsFamilyFilter,
  IsGameRuleFilter,
  IsHumidFilter,
  IsImmobileFilter,
  IsInVillageFilter,
  IsLeashedFilter,
  IsLeashedToFilter,
  IsMarkVariantFilter,
  IsMissingHealthFilter,
  IsMovingFilter,
  IsNavigatingFilter,
  IsOwnerFilter,
  IsPersistentFilter,
  IsRidingFilter,
  IsRidingSelfFilter,
  IsSittingFilter,
  IsSkinIdFilter,
  IsSleepingFilter,
  IsSneakHeldFilter,
  IsSneakingFilter,
  IsSprintingFilter,
  IsTamedFilter,
  IsSnowCoveredFilter,
  IsTargetFilter,
  IsTemperatureTypeFilter,
  IsTemperatureValueFilter,
  IsUndergroundFilter,
  IsUnderwaterFilter,
  IsVariantFilter,
  IsVehicleFamilyFilter,
  IsWeatherFilter,
  IsVisibleFilter,
  IsWaterloggedFilter,
  LightLevelFilter,
  MoonIntensityFilter,
  MoonPhaseFilter,
  OnGroundFilter,
  OnLadderFilter,
  OwnerDistanceFilter,
  RandomChanceFilter,
  RiderCountFilter,
  SurfaceMobFilter,
  TakingFireDamageFilter,
  TargetDistanceFilter,
  TrustsFilter,
  WeatherAtPositionFilter,
  WeatherFilter,
  YRotationFilter,
} from './filters/index';

export interface EntityFilterFactory {
  actor_health: ActorHealthFilter;
  all_slots_empty: AllSlotsEmptyFilter;
  any_slots_empty: AnySlotsEmptyFilter;
  bool_property: BoolPropertyFilter;
  clock_time: ClockTimeFilter;
  distance_to_nearest_player: DistanceToNearestPlayerFilter;
  enum_property: EnumPropertyFilter;
  float_property: FloatPropertyFilter;
  has_ability: HasAbilityFilter;
  has_biome_tag: HasBiomeTagFilter;
  has_component: HasComponentFilter;
  has_container_open: HasContainerOpenFilter;
  has_damage: HasDamageFilter;
  has_damaged_equipment: HasDamagedEquipmentFilter;
  has_equipment: HasEquipmentFilter;
  has_item_with_component: HasItemWithComponentFilter;
  has_same_equipment_in_slot_as: HasSameEquipmentInSlotAsFilter;
  has_equipment_tag: HasEquipmentTagFilter;
  has_mob_effect: HasMobEffectFilter;
  has_nametag: HasNametagFilter;
  has_property: HasPropertyFilter;
  has_ranged_weapon: HasRangedWeaponFilter;
  has_silk_touch: HasSilkTouchFilter;
  has_tag: HasTagFilter;
  has_target: HasTargetFilter;
  has_trade_supply: HasTradeSupplyFilter;
  home_distance: HomeDistanceFilter;
  hourly_clock_time: HourlyClockTimeFilter;
  in_block: InBlockFilter;
  in_caravan: InCaravanFilter;
  in_clouds: InCloudsFilter;
  in_contact_with_water: InContactWithWaterFilter;
  in_lava: InLavaFilter;
  in_nether: InNetherFilter;
  in_overworld: InOverworldFilter;
  in_water: InWaterFilter;
  in_water_or_rain: InWaterOrRainFilter;
  inactivity_timer: InactivityTimerFilter;
  int_property: IntPropertyFilter;
  is_altitude: IsAltitudeFilter;
  is_avoiding_mobs: IsAvoidingMobsFilter;
  is_biome: IsBiomeFilter;
  is_block: IsBlockFilter;
  is_bound_to_creaking_heart: IsBoundToCreakingHeartFilter;
  is_brightness: IsBrightnessFilter;
  is_climbing: IsClimbingFilter;
  is_color: IsColorFilter;
  is_controlling_passenger_family: IsControllingPassengerFamilyFilter;
  is_daytime: IsDaytimeFilter;
  is_difficulty: IsDifficultyFilter;
  is_family: IsFamilyFilter;
  is_game_rule: IsGameRuleFilter;
  is_humid: IsHumidFilter;
  is_immobile: IsImmobileFilter;
  is_in_village: IsInVillageFilter;
  is_leashed: IsLeashedFilter;
  is_leashed_to: IsLeashedToFilter;
  is_mark_variant: IsMarkVariantFilter;
  is_missing_health: IsMissingHealthFilter;
  is_moving: IsMovingFilter;
  is_navigating: IsNavigatingFilter;
  is_owner: IsOwnerFilter;
  is_persistent: IsPersistentFilter;
  is_riding: IsRidingFilter;
  is_riding_self: IsRidingSelfFilter;
  is_sitting: IsSittingFilter;
  is_skin_id: IsSkinIdFilter;
  is_sleeping: IsSleepingFilter;
  is_sneak_held: IsSneakHeldFilter;
  is_sneaking: IsSneakingFilter;
  is_sprinting: IsSprintingFilter;
  is_tamed: IsTamedFilter;
  is_snow_covered: IsSnowCoveredFilter;
  is_target: IsTargetFilter;
  is_temperature_type: IsTemperatureTypeFilter;
  is_temperature_value: IsTemperatureValueFilter;
  is_underground: IsUndergroundFilter;
  is_underwater: IsUnderwaterFilter;
  is_variant: IsVariantFilter;
  is_vehicle_family: IsVehicleFamilyFilter;
  is_weather: IsWeatherFilter;
  is_visible: IsVisibleFilter;
  is_waterlogged: IsWaterloggedFilter;
  light_level: LightLevelFilter;
  moon_intensity: MoonIntensityFilter;
  moon_phase: MoonPhaseFilter;
  on_ground: OnGroundFilter;
  on_ladder: OnLadderFilter;
  owner_distance: OwnerDistanceFilter;
  random_chance: RandomChanceFilter;
  rider_count: RiderCountFilter;
  surface_mob: SurfaceMobFilter;
  taking_fire_damage: TakingFireDamageFilter;
  target_distance: TargetDistanceFilter;
  trusts: TrustsFilter;
  weather: WeatherFilter;
  weather_at_position: WeatherAtPositionFilter;
  y_rotation: YRotationFilter;
}

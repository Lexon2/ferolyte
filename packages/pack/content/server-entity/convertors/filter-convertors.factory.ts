import { convertActorHealthFilter } from './filters/actor-health-filter';
import { convertAllSlotsEmptyFilter } from './filters/all-slots-empty-filter';
import { convertAnySlotsEmptyFilter } from './filters/any-slots-empty-filter';
import { convertBoolPropertyFilter } from './filters/bool-property-filter';
import { convertClockTimeFilter } from './filters/clock-time-filter';
import { convertDistanceToNearestPlayerFilter } from './filters/distance-to-nearest-player-filter';
import { convertEnumPropertyFilter } from './filters/enum-property-filter';
import { convertFloatPropertyFilter } from './filters/float-property-filter';
import { convertHasAbilityFilter } from './filters/has-ability-filter';
import { convertHasBiomeTagFilter } from './filters/has-biome-tag-filter';
import { convertHasComponentFilter } from './filters/has-component-filter';
import { convertHasContainerOpenFilter } from './filters/has-container-open-filter';
import { convertHasDamageFilter } from './filters/has-damage-filter';
import { convertHasDamagedEquipmentFilter } from './filters/has-damaged-equipment-filter';
import { convertHasEquipmentFilter } from './filters/has-equipment-filter';
import { convertHasItemWithComponentFilter } from './filters/has-item-with-component-filter';
import { convertHasSameEquipmentInSlotAsFilter } from './filters/has-same-equipment-in-slot-as-filter';
import { convertHasEquipmentTagFilter } from './filters/has-equipment-tag-filter';
import { convertHasMobEffectFilter } from './filters/has-mob-effect-filter';
import { convertHasNametagFilter } from './filters/has-nametag-filter';
import { convertHasPropertyFilter } from './filters/has-property-filter';
import { convertHasRangedWeaponFilter } from './filters/has-ranged-weapon-filter';
import { convertHasSilkTouchFilter } from './filters/has-silk-touch-filter';
import { convertHasTagFilter } from './filters/has-tag-filter';
import { convertHasTargetFilter } from './filters/has-target-filter';
import { convertHasTradeSupplyFilter } from './filters/has-trade-supply-filter';
import { convertHomeDistanceFilter } from './filters/home-distance-filter';
import { convertHourlyClockTimeFilter } from './filters/hourly-clock-time-filter';
import { convertInBlockFilter } from './filters/in-block-filter';
import { convertInCaravanFilter } from './filters/in-caravan-filter';
import { convertInCloudsFilter } from './filters/in-clouds-filter';
import { convertInContactWithWaterFilter } from './filters/in-contact-with-water-filter';
import { convertInLavaFilter } from './filters/in-lava-filter';
import { convertInNetherFilter } from './filters/in-nether-filter';
import { convertInOverworldFilter } from './filters/in-overworld-filter';
import { convertInWaterFilter } from './filters/in-water-filter';
import { convertInWaterOrRainFilter } from './filters/in-water-or-rain-filter';
import { convertInactivityTimerFilter } from './filters/inactivity-timer-filter';
import { convertIntPropertyFilter } from './filters/int-property-filter';
import { convertIsAltitudeFilter } from './filters/is-altitude-filter';
import { convertIsAvoidingMobsFilter } from './filters/is-avoiding-mobs-filter';
import { convertIsBiomeFilter } from './filters/is-biome-filter';
import { convertIsBlockFilter } from './filters/is-block-filter';
import { convertIsBoundToCreakingHeartFilter } from './filters/is-bound-to-creaking-heart-filter';
import { convertIsBrightnessFilter } from './filters/is-brightness-filter';
import { convertIsClimbingFilter } from './filters/is-climbing-filter';
import { convertIsColorFilter } from './filters/is-color-filter';
import { convertIsControllingPassengerFamilyFilter } from './filters/is-controlling-passenger-family-filter';
import { convertIsDaytimeFilter } from './filters/is-daytime-filter';
import { convertIsDifficultyFilter } from './filters/is-difficulty-filter';
import { convertIsFamilyFilter } from './filters/is-family-filter';
import { convertIsGameRuleFilter } from './filters/is-game-rule-filter';
import { convertIsHumidFilter } from './filters/is-humid-filter';
import { convertIsImmobileFilter } from './filters/is-immobile-filter';
import { convertIsInVillageFilter } from './filters/is-in-village-filter';
import { convertIsLeashedFilter } from './filters/is-leashed-filter';
import { convertIsLeashedToFilter } from './filters/is-leashed-to-filter';
import { convertIsMarkVariantFilter } from './filters/is-mark-variant-filter';
import { convertIsMissingHealthFilter } from './filters/is-missing-health-filter';
import { convertIsMovingFilter } from './filters/is-moving-filter';
import { convertIsNavigatingFilter } from './filters/is-navigating-filter';
import { convertIsOwnerFilter } from './filters/is-owner-filter';
import { convertIsPersistentFilter } from './filters/is-persistent-filter';
import { convertIsRidingFilter } from './filters/is-riding-filter';
import { convertIsRidingSelfFilter } from './filters/is-riding-self-filter';
import { convertIsSittingFilter } from './filters/is-sitting-filter';
import { convertIsSkinIdFilter } from './filters/is-skin-id-filter';
import { convertIsSleepingFilter } from './filters/is-sleeping-filter';
import { convertIsSneakHeldFilter } from './filters/is-sneak-held-filter';
import { convertIsSneakingFilter } from './filters/is-sneaking-filter';
import { convertIsSprintingFilter } from './filters/is-sprinting-filter';
import { convertIsTamedFilter } from './filters/is-tamed-filter';
import { convertIsSnowCoveredFilter } from './filters/is-snow-covered-filter';
import { convertIsTargetFilter } from './filters/is-target-filter';
import { convertIsTemperatureTypeFilter } from './filters/is-temperature-type-filter';
import { convertIsTemperatureValueFilter } from './filters/is-temperature-value-filter';
import { convertIsUndergroundFilter } from './filters/is-underground-filter';
import { convertIsUnderwaterFilter } from './filters/is-underwater-filter';
import { convertIsVariantFilter } from './filters/is-variant-filter';
import { convertIsVehicleFamilyFilter } from './filters/is-vehicle-family-filter';
import { convertIsWeatherFilter } from './filters/is-weather-filter';
import { convertIsVisibleFilter } from './filters/is-visible-filter';
import { convertIsWaterloggedFilter } from './filters/is-waterlogged-filter';
import { convertLightLevelFilter } from './filters/light-level-filter';
import { convertMoonIntensityFilter } from './filters/moon-intensity-filter';
import { convertMoonPhaseFilter } from './filters/moon-phase-filter';
import { convertOnGroundFilter } from './filters/on-ground-filter';
import { convertOnLadderFilter } from './filters/on-ladder-filter';
import { convertOwnerDistanceFilter } from './filters/owner-distance-filter';
import { convertRandomChanceFilter } from './filters/random-chance-filter';
import { convertRiderCountFilter } from './filters/rider-count-filter';
import { convertSurfaceMobFilter } from './filters/surface-mob-filter';
import { convertTakingFireDamageFilter } from './filters/taking-fire-damage-filter';
import { convertTargetDistanceFilter } from './filters/target-distance-filter';
import { convertTrustsFilter } from './filters/trusts-filter';
import { convertWeatherAtPositionFilter } from './filters/weather-at-position-filter';
import { convertWeatherFilter } from './filters/weather-filter';
import { convertYRotationFilter } from './filters/y-rotation-filter';

export const entityFilterConvertorsFactory: Record<string, (v?: any) => any> = {
  actor_health: convertActorHealthFilter,
  all_slots_empty: convertAllSlotsEmptyFilter,
  any_slots_empty: convertAnySlotsEmptyFilter,
  bool_property: convertBoolPropertyFilter,
  clock_time: convertClockTimeFilter,
  distance_to_nearest_player: convertDistanceToNearestPlayerFilter,
  enum_property: convertEnumPropertyFilter,
  float_property: convertFloatPropertyFilter,
  has_ability: convertHasAbilityFilter,
  has_biome_tag: convertHasBiomeTagFilter,
  has_component: convertHasComponentFilter,
  has_container_open: convertHasContainerOpenFilter,
  has_damage: convertHasDamageFilter,
  has_damaged_equipment: convertHasDamagedEquipmentFilter,
  has_equipment: convertHasEquipmentFilter,
  has_item_with_component: convertHasItemWithComponentFilter,
  has_same_equipment_in_slot_as: convertHasSameEquipmentInSlotAsFilter,
  has_equipment_tag: convertHasEquipmentTagFilter,
  has_mob_effect: convertHasMobEffectFilter,
  has_nametag: convertHasNametagFilter,
  has_property: convertHasPropertyFilter,
  has_ranged_weapon: convertHasRangedWeaponFilter,
  has_silk_touch: convertHasSilkTouchFilter,
  has_tag: convertHasTagFilter,
  has_target: convertHasTargetFilter,
  has_trade_supply: convertHasTradeSupplyFilter,
  home_distance: convertHomeDistanceFilter,
  hourly_clock_time: convertHourlyClockTimeFilter,
  in_block: convertInBlockFilter,
  in_caravan: convertInCaravanFilter,
  in_clouds: convertInCloudsFilter,
  in_contact_with_water: convertInContactWithWaterFilter,
  in_lava: convertInLavaFilter,
  in_nether: convertInNetherFilter,
  in_overworld: convertInOverworldFilter,
  in_water: convertInWaterFilter,
  in_water_or_rain: convertInWaterOrRainFilter,
  inactivity_timer: convertInactivityTimerFilter,
  int_property: convertIntPropertyFilter,
  is_altitude: convertIsAltitudeFilter,
  is_avoiding_mobs: convertIsAvoidingMobsFilter,
  is_biome: convertIsBiomeFilter,
  is_block: convertIsBlockFilter,
  is_bound_to_creaking_heart: convertIsBoundToCreakingHeartFilter,
  is_brightness: convertIsBrightnessFilter,
  is_climbing: convertIsClimbingFilter,
  is_color: convertIsColorFilter,
  is_controlling_passenger_family: convertIsControllingPassengerFamilyFilter,
  is_daytime: convertIsDaytimeFilter,
  is_difficulty: convertIsDifficultyFilter,
  is_family: convertIsFamilyFilter,
  is_game_rule: convertIsGameRuleFilter,
  is_humid: convertIsHumidFilter,
  is_immobile: convertIsImmobileFilter,
  is_in_village: convertIsInVillageFilter,
  is_leashed: convertIsLeashedFilter,
  is_leashed_to: convertIsLeashedToFilter,
  is_mark_variant: convertIsMarkVariantFilter,
  is_missing_health: convertIsMissingHealthFilter,
  is_moving: convertIsMovingFilter,
  is_navigating: convertIsNavigatingFilter,
  is_owner: convertIsOwnerFilter,
  is_persistent: convertIsPersistentFilter,
  is_riding: convertIsRidingFilter,
  is_riding_self: convertIsRidingSelfFilter,
  is_sitting: convertIsSittingFilter,
  is_skin_id: convertIsSkinIdFilter,
  is_sleeping: convertIsSleepingFilter,
  is_sneak_held: convertIsSneakHeldFilter,
  is_sneaking: convertIsSneakingFilter,
  is_sprinting: convertIsSprintingFilter,
  is_tamed: convertIsTamedFilter,
  is_snow_covered: convertIsSnowCoveredFilter,
  is_target: convertIsTargetFilter,
  is_temperature_type: convertIsTemperatureTypeFilter,
  is_temperature_value: convertIsTemperatureValueFilter,
  is_underground: convertIsUndergroundFilter,
  is_underwater: convertIsUnderwaterFilter,
  is_variant: convertIsVariantFilter,
  is_vehicle_family: convertIsVehicleFamilyFilter,
  is_weather: convertIsWeatherFilter,
  is_visible: convertIsVisibleFilter,
  is_waterlogged: convertIsWaterloggedFilter,
  light_level: convertLightLevelFilter,
  moon_intensity: convertMoonIntensityFilter,
  moon_phase: convertMoonPhaseFilter,
  on_ground: convertOnGroundFilter,
  on_ladder: convertOnLadderFilter,
  owner_distance: convertOwnerDistanceFilter,
  random_chance: convertRandomChanceFilter,
  rider_count: convertRiderCountFilter,
  surface_mob: convertSurfaceMobFilter,
  taking_fire_damage: convertTakingFireDamageFilter,
  target_distance: convertTargetDistanceFilter,
  trusts: convertTrustsFilter,
  weather: convertWeatherFilter,
  weather_at_position: convertWeatherAtPositionFilter,
  y_rotation: convertYRotationFilter,
};

export type RideableDismountMode = 'on_top_center' | 'default';

export const RIDEABLE_DISMOUNT_MODE_VALUES: RideableDismountMode[] = [
  'on_top_center',
  'default',
];

export const validateRideableDismountMode = (
  value: RideableDismountMode,
): value is RideableDismountMode => {
  if (!RIDEABLE_DISMOUNT_MODE_VALUES.includes(value as RideableDismountMode)) {
    console.error(`Invalid rideable dismount mode: ${value}`);

    return false;
  }

  return true;
};

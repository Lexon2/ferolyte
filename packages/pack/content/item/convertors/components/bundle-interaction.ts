interface BundleInteractionOptions {
  numViewableSlots?: number;
}

/**
 * Creates a bundle_interaction component for Minecraft items
 * @param options The bundle interaction options
 * @returns The bundle_interaction component in Minecraft format or undefined if validation fails
 */
export const createBundleInteraction = (
  options?: BundleInteractionOptions,
): { 'minecraft:bundle_interaction': any } | undefined => {
  if (!options) {
    return undefined;
  }

  const result: any = {};

  if (typeof options.numViewableSlots === 'number') {
    result.num_viewable_slots = options.numViewableSlots;
  }

  return {
    'minecraft:bundle_interaction': result,
  };
};

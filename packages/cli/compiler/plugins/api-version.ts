export const enum FerolytePluginApiVersion {
  V1_0_0 = '1.0.0',
  V1_1_0 = '1.1.0',
  V1_2_0 = '1.2.0',
}

export const SUPPORTED_PLUGIN_API_VERSIONS = [
  FerolytePluginApiVersion.V1_0_0,
  FerolytePluginApiVersion.V1_1_0,
  FerolytePluginApiVersion.V1_2_0,
] as const;

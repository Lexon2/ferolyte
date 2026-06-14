/**
 * Represents the output format for filter converters in Minecraft format
 */
export interface MinecraftJsonFilter {
  test: string;
  subject?: string;
  operator?: string;
  value?: any;
  domain?: string;
}

// Temporary interface is unused, but will be used in the future.
export interface MinecraftClientEntity {
  format_version: string;
  'minecraft:client_entity': {
    description: {
      identifier: string;
      animations?: Record<string, string>;
      geometry?: string;
      materials?: Record<string, string>;
      textures?: Record<string, string>;
      scripts?: Record<string, any>;
      enable_attachables?: boolean;
      scale?: number;
    };
  };
}

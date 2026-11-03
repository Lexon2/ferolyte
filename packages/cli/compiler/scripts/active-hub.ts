import type { MinecraftHub } from './minecraft-hub';

let activeHub: MinecraftHub | undefined;

/**
 * The hub started by `startMinecraftServer` (`watch`), or nothing (`run`, `check`). Kept out of the hub module so
 * code that only asks for the hub does not load the WebSocket server.
 */
export const getMinecraftHub = (): MinecraftHub | undefined => activeHub;

export const setActiveHub = (hub: MinecraftHub | undefined): void => {
  activeHub = hub;
};

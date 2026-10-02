import { BUILD_CONTEXT } from '../build-context';
import { setMinecraftContext } from '../plugins/plugin-host';
import type { FerolyteMinecraftContext } from '../plugins/types';
import { MinecraftHttpApi } from './minecraft-http';
import { MinecraftHub } from './minecraft-hub';

let activeHub: MinecraftHub | undefined;

export const getMinecraftHub = () => activeHub;

export const createMinecraftContext = (
  hub: MinecraftHub,
  http?: MinecraftHttpApi,
): FerolyteMinecraftContext => ({
  get clients() {
    return hub.clients;
  },
  sendCommand: (command, options) => hub.sendCommand(command, options),
  scriptEvent: (id, message, options) => hub.scriptEvent(id, message, options),
  subscribe: (eventName, handler) => hub.subscribe(eventName, handler),
  onMessage: (handler) => hub.onMessage(handler),
  http: http && {
    route: (method, path, handler) => http.route(method, path, handler),
  },
});

/**
 * Starts the hub (and optional HTTP API) from the active profile and exposes it
 * to plugins. Returns a disposer that closes everything.
 */
export const startMinecraftServer = async (): Promise<() => Promise<void>> => {
  const { PORT, HTTP } = BUILD_CONTEXT.SERVER;
  const hub = await MinecraftHub.listen(PORT);
  let http: MinecraftHttpApi | undefined;

  try {
    if (HTTP) {
      http = new MinecraftHttpApi(hub);
      await http.listen(HTTP.port, HTTP.host);
    }
  } catch (error) {
    await hub.close();
    throw error;
  }

  activeHub = hub;
  setMinecraftContext(createMinecraftContext(hub, http));
  console.log(`To use automatic reload type: /connect localhost:${PORT}`);
  if (http && HTTP) {
    console.log(`HTTP API: http://${HTTP.host}:${http.port}`);
  }

  return async () => {
    if (activeHub === hub) {
      activeHub = undefined;
      setMinecraftContext(undefined);
    }
    await Promise.all([http?.close(), hub.close()]);
  };
};

import { ClientEntityAnimationsCollection } from './interfaces/animations-collection';
import { ClientEntityConfig } from './interfaces/client-entity-config';

export const defineClientEntityConfig = <
  A extends ClientEntityAnimationsCollection = ClientEntityAnimationsCollection,
>(
  config: ClientEntityConfig<A>,
) => config;

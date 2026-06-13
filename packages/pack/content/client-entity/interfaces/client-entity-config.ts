import {
  EntityGeometriesCollection,
  EntityMaterialsCollection,
  EntityTexturesCollection,
  EntityRenderContollersCollection,
} from '../types';
import { ClientEntityAnimationsCollection } from './animations-collection';
import { ClientEntityScriptsConfig } from './scripts-config';

type ClientEntityVersions = '1.10.0' | '1.8.0';

/**
 * A client side entity definition.
 */
export interface ClientEntityConfig<
  Animations extends
    ClientEntityAnimationsCollection = ClientEntityAnimationsCollection,
> {
  /**
   * The version of the client entity config.
   * @default '1.10.0'
   */
  version?: ClientEntityVersions;

  /**
   * The identifier of the client entity.
   */
  // @TODO: Replace with common Identifier type
  identifier: string;

  /**
   * The materials of the client entity.
   * @description It can be a string or a record of materials. If string specified, it will be used `{ "default": "material_name" }` by default.
   */
  materials?: EntityMaterialsCollection;

  /**
   * The geometry of the client entity.
   * @description It can be a string or a record of geometries. If string specified, it will be used `{ "default": "geometry_name" }` by default.
   */
  geometry?: EntityGeometriesCollection;

  /**
   * The textures of the client entity.
   * @description It can be a string or a record of textures. If string specified, it will be used `{ "default": "texture_name" }` by default.
   */
  textures?: EntityTexturesCollection;

  /**
   * The minimum engine version required to use this client entity.
   */
  minEngineVersion?: `${number}.${number}.${number}`;

  /**
   * The animations of the client entity.
   */
  animations?: Animations;

  /**
   * The sound effects of the client entity.
   */
  soundEffects?: Record<string, string>;

  /**
   * The particle effects of the client entity.
   */
  particleEffects?: Record<string, string>;

  /**
   * The particle emitters of the client entity.
   */
  particleEmitters?: Record<string, string>;

  /**
   * The scripts of the client entity.
   */
  scripts?: ClientEntityScriptsConfig<Animations>;

  /**
   * The render controllers of the client entity.
   */
  renderControllers?: EntityRenderContollersCollection;

  /**
   * The hide armor of the client entity.
   * @default true
   */
  hideArmor?: boolean;

  /**
   * Whether or not attachables are enaboled.
   */
  enableAttachables?: boolean;

  /**
   * This determines if the item held by an entity should render fully lit up (if true), or depending on surrounding lighting.
   * @default false
   */
  heldItemIgnoresLighting?: boolean;

  /**
   * UNDOCUMENTED.
   */
  queryableGeometry?: string;

  /**
   * The definition of how the spawn_egg icon looks like.
   */
  spawnEgg?:
    | {
        baseColor: `#${string}`;
        overlayColor: `#${string}`;
      }
    | {
        texture: string;
        textureIndex: number;
      };
}

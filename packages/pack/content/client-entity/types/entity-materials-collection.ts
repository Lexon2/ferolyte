import { EntityVanillaMaterials } from "../constants/entity-vanilla-materials";

/**
 * The materials of the client entity.
 * @description It can be a string or a record of materials. If string specified, it will be used `{ "default": "material_name" }` by default.
 */
export type EntityMaterialsCollection = EntityMaterialName | Record<string, EntityMaterialName>;

export type EntityMaterialName = EntityVanillaMaterials | (string & {});
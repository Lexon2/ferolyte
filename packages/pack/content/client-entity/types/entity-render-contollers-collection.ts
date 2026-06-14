import { MolangMath, MolangQuery } from '../../molang/types';

export type EntityRenderContollerName =
  | `controller.render.`
  | `controller.render.default`
  | (string & {});

export type EntityRenderContollersCollection = (
  | EntityRenderContollerName
  | Partial<Record<EntityRenderContollerName, MolangQuery | MolangMath>>
)[];

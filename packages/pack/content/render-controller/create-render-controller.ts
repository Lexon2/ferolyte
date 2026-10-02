import {
  RenderControllerBuilder,
  type RenderControllerConfig,
} from './render-controller-builder';

/**
 * Creates one render controller (`*.rc.ts` -> RP `render_controllers/`). A file may export several
 * builders (an array): they are written into one JSON. For a 1:1 mirror of the JSON file use
 * `createRenderControllerDocument`.
 */
export const createRenderController = (
  config: RenderControllerConfig,
): RenderControllerBuilder => new RenderControllerBuilder(config);

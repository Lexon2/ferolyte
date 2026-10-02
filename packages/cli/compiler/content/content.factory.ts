import { basename } from 'path';

import { buildBlockJson } from './block/build';
import { buildAnimationControllerJson } from './animation-controller-build';
import { buildClientEntityJson } from './client-entity/build';
import { buildAttachableJson } from './attachable/build';
import { buildDocumentJson } from './document/build';
import { buildRenderControllerJson } from './render-controller/build';
import { buildItemJson } from './items/build';
import { buildServerEntityJson } from './server-entity/build';
import { CONTENT_METADATA } from '@ferolyte/common/content/metadata';
import { ContentBuilder } from '@ferolyte/common/content/interfaces/content-builder';
import { ContentBuildOptions } from '../actions/options';
import { beginSourceLang, commitSourceLang } from '../lang/lang-registry';
import {
  beginSourceDocuments,
  commitSourceDocuments,
} from '../registry/project-registry';

const contentFactory = {
  [CONTENT_METADATA.ITEM]: buildItemJson,
  [CONTENT_METADATA.SERVER_ENTITY]: buildServerEntityJson,
  [CONTENT_METADATA.CLIENT_ENTITY]: buildClientEntityJson,
  [CONTENT_METADATA.BLOCK]: buildBlockJson,
  [CONTENT_METADATA.ATTACHABLE]: buildAttachableJson,
  [CONTENT_METADATA.RENDER_CONTROLLER]: buildRenderControllerJson,
  [CONTENT_METADATA.RECIPE]: buildDocumentJson,
  [CONTENT_METADATA.SPAWN_RULE]: buildDocumentJson,
  [CONTENT_METADATA.ANIMATION_CONTROLLER_BP]: buildAnimationControllerJson,
  [CONTENT_METADATA.ANIMATION_CONTROLLER_RP]: buildAnimationControllerJson,
};

const GROUPED_METADATA: string[] = [
  CONTENT_METADATA.ANIMATION_CONTROLLER_BP,
  CONTENT_METADATA.ANIMATION_CONTROLLER_RP,
  CONTENT_METADATA.RENDER_CONTROLLER,
];

export const extractContent = (
  moduleExports: unknown,
): ContentBuilder | ContentBuilder[] | undefined => {
  const contentModule = (moduleExports as { default?: unknown } | undefined)
    ?.default;
  if (contentModule === undefined) {
    return;
  }
  return contentModule as ContentBuilder | ContentBuilder[];
};

export interface BuildContentJsonResult {
  source: string;
  outFile: string | string[];
}

export const buildContentJson = async (
  filePath: string,
  moduleExports: unknown,
  options: ContentBuildOptions = { debug: true, diagnostics: true },
): Promise<BuildContentJsonResult | Error | undefined> => {
  const { debug, diagnostics } = options;
  const filename = basename(filePath);

  const contentBuilder = extractContent(moduleExports);
  if (contentBuilder === undefined) {
    if (debug) {
      return new Error(`\n🛑 Failed to import content: ${filename}\n`);
    }
    return;
  }

  const outFiles: string[] = [];
  beginSourceLang(filePath);
  beginSourceDocuments(filePath);

  // Builders of a grouped type (animation controllers) share one output file.
  const all = Array.isArray(contentBuilder) ? contentBuilder : [contentBuilder];
  const groups = new Map<string, ContentBuilder[]>();
  const units: ContentBuilder[][] = [];
  for (const item of all) {
    const key = item.metadata ?? CONTENT_METADATA.UNKNOWN;
    const group = GROUPED_METADATA.includes(key) ? groups.get(key) : undefined;
    if (group) {
      group.push(item);
    } else {
      const unit = [item];
      units.push(unit);
      if (GROUPED_METADATA.includes(key)) {
        groups.set(key, unit);
      }
    }
  }

  for (const unit of units) {
    const builder = unit[0];
    const metadata = builder.metadata ?? CONTENT_METADATA.UNKNOWN;
    if (metadata === CONTENT_METADATA.UNKNOWN) {
      if (debug) {
        return new Error(`\n🛑 Unknown content type for file: ${filename}\n`);
      }
      return;
    }
    const buildFunction = contentFactory[metadata];
    if (!buildFunction) {
      if (debug) {
        return new Error(
          `\n🛑 No build function found for metadata: ${metadata}\n`,
        );
      }
      return;
    }

    const outFile = await buildFunction(
      filePath,
      (GROUPED_METADATA.includes(metadata) ? unit : builder) as any,
      {
        debug,
        diagnostics,
      },
    );
    if (outFile === undefined) {
      if (debug) {
        return new Error(`\n🛑 Failed to build: ${filename}\n`);
      }
      return;
    }
    outFiles.push(...(Array.isArray(outFile) ? outFile : [outFile]));
  }

  commitSourceLang(filePath);
  commitSourceDocuments(filePath);

  return {
    source: filePath,
    outFile: outFiles,
  };
};

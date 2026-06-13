import { ContentMetadata } from '@artifex/pack/compiler/content/types/content.metadata';

import { ContentDiagnosticContext } from '../diagnostics/content-diagnostic';

export interface ContentBuilder {
  readonly metadata: ContentMetadata;

  cloneConfig(): unknown;
  build(): unknown;
  withBuildContext?(ctx: ContentDiagnosticContext): this;
}

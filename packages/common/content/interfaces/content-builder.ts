import { ContentMetadata } from '../metadata';
import { ContentDiagnosticContext } from '../diagnostics/content-diagnostic';

export interface ContentBuilder {
  readonly metadata: ContentMetadata;

  cloneConfig(): unknown;
  build(): unknown;
  withBuildContext?(ctx: ContentDiagnosticContext): this;
}

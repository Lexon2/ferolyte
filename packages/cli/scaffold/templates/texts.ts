export interface LangTemplateInput {
  displayName: string;
}

export const createLangTemplate = ({ displayName }: LangTemplateInput): string =>
  `pack.name=${displayName}\npack.description=Artifex addon\n`;

export const createLanguagesJsonTemplate = (): string => `${JSON.stringify(['en_US'], null, 2)}\n`;

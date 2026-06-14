export interface MainScriptTemplateInput {
  displayName: string;
}

export const createMainScriptTemplate = ({
  displayName,
}: MainScriptTemplateInput): string =>
  `console.warn(\`[${displayName}] Artifex project started\`);\n`;

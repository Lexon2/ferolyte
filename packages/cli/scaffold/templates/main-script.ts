export interface MainScriptTemplateInput {
  displayName: string;
}

export const createMainScriptTemplate = ({
  displayName,
}: MainScriptTemplateInput): string =>
  `console.warn(\`[${displayName}] Ferolyte project started\`);\n`;

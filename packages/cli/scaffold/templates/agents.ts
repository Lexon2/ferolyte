export interface AgentsTemplateInput {
  displayName: string;
}

export const createAgentsTemplate = ({
  displayName,
}: AgentsTemplateInput): string => `# ${displayName}

Minecraft Bedrock add-on written with Ferolyte (TypeScript content files compiled to pack JSON).

Full rules, file suffix table and one example per content type:
\`node_modules/@ferolyte/pack/AGENTS.md\` (SDK index: \`node_modules/@ferolyte/pack/llms.txt\`).

Essentials:
- Content lives in \`packs/BP\` and \`packs/RP\`: \`*.item.ts\`, \`*.block.ts\`, \`*.se.ts\`, \`*.ce.ts\`, \`*.ac.bp.ts\`, \`*.ac.rp.ts\`; each \`export default\`s a builder.
- Import from \`@ferolyte/pack\`; config keys are camelCase.
- After every change run \`npx ferolyte check --json\` and fix all \`error\` records (exit code 1 = errors).
- \`npx ferolyte inspect <file>\` prints the JSON a content file produces.
`;

export const createClaudeMdTemplate = (): string =>
  `See [AGENTS.md](AGENTS.md) for the project and Ferolyte rules.\n`;

const ALIAS_PATTERN = /^[a-z][a-z0-9_]*$/;

export const toSlug = (projectName: string): string =>
  projectName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const toNamespace = (projectName: string): string =>
  toSlug(projectName).replace(/-/g, '_');

export const toDisplayName = (projectName: string): string =>
  projectName.trim().replace(/\s+/g, ' ');

export const toPathAlias = (slug: string): string => `@${slug}`;

export const validateAlias = (alias: string): void => {
  if (!ALIAS_PATTERN.test(alias)) {
    throw new Error(
      `Invalid alias "${alias}". Use lowercase letters, digits, and underscores; must start with a letter.`,
    );
  }
};

export const validateProjectName = (projectName: string): string => {
  const slug = toSlug(projectName);

  if (!slug) {
    throw new Error('Project name must contain at least one letter or digit.');
  }

  return slug;
};

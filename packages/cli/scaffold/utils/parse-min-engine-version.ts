export const parseMinEngineVersion = (
  minGameVersion: string,
): [number, number, number] => {
  const parts = minGameVersion.split('.').map((part) => Number.parseInt(part, 10));

  if (parts.length < 3 || parts.some((part) => Number.isNaN(part))) {
    throw new Error(
      `Invalid min game version "${minGameVersion}". Expected format: major.minor.patch`,
    );
  }

  return [parts[0], parts[1], parts[2]];
};

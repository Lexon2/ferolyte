export const namespaceToPath = (
  namespace: string,
  separator: '/' | '\\',
): string => namespace.toLowerCase().split('_').join(separator);

export const createManifestScriptEntry = (namespace: string): string =>
  `scripts/${namespaceToPath(namespace, '/')}/index.js`;

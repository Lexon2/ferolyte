export const unixify = (path: string): string => {
  return path.replace(/\\/g, '/');
}

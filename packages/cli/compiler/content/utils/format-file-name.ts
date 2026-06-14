/**
 * Formats a file name according to Minecraft shader naming conventions
 * @param fileName The original file name to format
 * @param extension Optional file extension (without the dot)
 * @returns Properly formatted shader file name
 */
export const formatFileName = (
  fileName: string,
  extension?: string,
): string | undefined => {
  // Remove any file extension if present
  let name = fileName.includes('.') ? fileName.split('.')[0] : fileName;

  if (name.length === 0) {
    return;
  }

  // Convert to lowercase (Minecraft convention)
  name = name.toLowerCase();

  // Replace spaces with underscores
  name = name.replace(/\s+/g, '_');
  name = name.replace(/-/g, '_');

  // Remove any special characters except underscores and alphanumeric
  name = name.replace(/[^a-z0-9_]/g, '');

  // Add appropriate extension if provided
  if (extension) {
    // Remove any leading dot from the extension
    const ext = extension.startsWith('.') ? extension.substring(1) : extension;

    return `${name}.${ext}`;
  }

  return name;
};

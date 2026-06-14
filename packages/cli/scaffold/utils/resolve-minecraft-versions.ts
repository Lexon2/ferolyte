import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export interface MinecraftPackageVersions {
  server: string;
  serverUi: string;
  vanillaData: string;
  debugUtilities: string;
}

const FALLBACK_VERSIONS: MinecraftPackageVersions = {
  server: '2.7.0',
  serverUi: '2.0.0',
  vanillaData: '1.26.20',
  debugUtilities: '1.0.0-beta',
};

const resolvePackageVersion = async (packageName: string): Promise<string | null> => {
  try {
    const { stdout } = await execFileAsync(
      process.platform === 'win32' ? 'npm.cmd' : 'npm',
      ['view', packageName, 'version'],
      { timeout: 15_000 },
    );

    const version = stdout.trim();

    return version || null;
  } catch {
    return null;
  }
};

export const resolveMinecraftVersions = async (): Promise<MinecraftPackageVersions> => {
  const [server, serverUi, vanillaData, debugUtilities] = await Promise.all([
    resolvePackageVersion('@minecraft/server'),
    resolvePackageVersion('@minecraft/server-ui'),
    resolvePackageVersion('@minecraft/vanilla-data'),
    resolvePackageVersion('@minecraft/debug-utilities'),
  ]);

  return {
    server: server ?? FALLBACK_VERSIONS.server,
    serverUi: serverUi ?? FALLBACK_VERSIONS.serverUi,
    vanillaData: vanillaData ?? FALLBACK_VERSIONS.vanillaData,
    debugUtilities: debugUtilities ?? FALLBACK_VERSIONS.debugUtilities,
  };
};

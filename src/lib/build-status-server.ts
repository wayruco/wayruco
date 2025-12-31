import fs from 'fs';
import path from 'path';

export const getServerBuildStatus = (): {
  isReady: boolean;
  hasWarnings: boolean;
  lastBuild?: string;
  buildAge?: number;
} => {
  // Check if build directory exists
  const buildDirPath = path.join(process.cwd(), '.next');
  const hasBuildDir = fs.existsSync(buildDirPath);

  let lastBuild: string | undefined;
  let buildAge: number | undefined;

  if (hasBuildDir) {
    try {
      const stats = fs.statSync(buildDirPath);
      lastBuild = stats.mtime.toISOString();
      buildAge = Date.now() - stats.mtime.getTime();
    } catch (error) {
      // Ignore errors
    }
  }

  const isReady = hasBuildDir && (!buildAge || buildAge < 24 * 60 * 60 * 1000);
  const hasWarnings = Boolean(buildAge && buildAge > 24 * 60 * 60 * 1000);

  return {
    isReady,
    hasWarnings,
    lastBuild,
    buildAge,
  };
};

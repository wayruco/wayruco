import versionData from "../../version.json";

export interface VersionInfo {
  version: string;
  buildNumber: string;
  releaseDate: string;
  metadata: {
    name: string;
    description: string;
    author: string;
    license: string;
    repository: string;
    homepage: string;
  };
  git: {
    commit: string;
    branch: string;
    tag: string;
  };
  build: {
    environment: string;
    nodeVersion: string;
    timestamp: string;
    duration: number;
  };
}

export const getVersion = (): VersionInfo => {
  return versionData as VersionInfo;
};

export const getVersionString = (): string => {
  const v = getVersion();
  return `v${v.version} (${v.buildNumber})`;
};

export const getShortVersion = (): string => {
  return `v${getVersion().version}`;
};

export const getBuildInfo = (): string => {
  const v = getVersion();
  return `Build ${v.buildNumber} • ${v.releaseDate}`;
};

export const isDevelopment = (): boolean => {
  return getVersion().build.environment === "development";
};

export const isProduction = (): boolean => {
  return getVersion().build.environment === "production";
};

export const getEnvironment = (): string => {
  return getVersion().build.environment;
};

export const getBuildStatus = (): {
  isReady: boolean;
  hasWarnings: boolean;
  lastBuild?: string;
  buildAge?: number;
} => {
  // Return default values for client-side
  // Server-side should use getServerBuildStatus from build-status-server.ts
  return {
    isReady: true,
    hasWarnings: false,
    lastBuild: undefined,
    buildAge: undefined,
  };
};

export const formatBuildAge = (ageMs: number): string => {
  const hours = Math.floor(ageMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return `${hours} hour${hours > 1 ? "s" : ""} ago`;
};

/**
 * Repository Manifest Types
 * Defines the structure for managing Wayru Network repositories
 */

export type RepositoryCategory = 'app' | 'package' | 'contract' | 'tool';
export type RepositoryPriority = 'critical' | 'important' | 'nice-to-have';
export type RepositoryStatus = 'pending' | 'forked' | 'integrated' | 'deprecated';

/**
 * Represents a single repository in the manifest
 */
export interface Repository {
  /** Unique identifier for the repository */
  name: string;

  /** Original GitHub URL (e.g., https://github.com/Wayru-Network/repo-name) */
  source: string;

  /** Local workspace path (e.g., apps/landing, packages/sdk) */
  workspace: string;

  /** Category determining where the repository belongs */
  category: RepositoryCategory;

  /** Priority level for forking and integration */
  priority: RepositoryPriority;

  /** Current status of the repository */
  status: RepositoryStatus;

  /** Human-readable description of the repository */
  description: string;

  /** Technology stack (e.g., TypeScript, Rust, Go) */
  technologies: string[];

  /** List of maintainers */
  maintainers: string[];

  /** Upstream synchronization configuration */
  upstreamSync: {
    /** Whether to sync with upstream repository */
    enabled: boolean;

    /** Last synchronization timestamp (ISO 8601) */
    lastSync: string | null;

    /** Branch to sync from */
    branch: string;
  };
}

/**
 * Complete repository manifest
 */
export interface RepositoryManifest {
  /** Manifest version for compatibility tracking */
  version: string;

  /** Last update timestamp (ISO 8601) */
  lastUpdated: string;

  /** Array of repositories */
  repositories: Repository[];
}

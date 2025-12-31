/**
 * Repository Categorization
 * Determines the appropriate category for a repository based on its characteristics
 */
import { RepositoryCategory } from './types';
/**
 * Repository metadata for categorization
 */
export interface RepositoryMetadata {
    name: string;
    description: string;
    technologies: string[];
    purpose?: string;
}
/**
 * Categorizes a repository based on its metadata
 *
 * @param metadata - Repository metadata containing name, description, and technologies
 * @returns The determined category: 'app', 'package', 'contract', or 'tool'
 *
 * Categorization rules (in order of precedence):
 * 1. Smart contracts: If technologies include Solidity, Rust (for contracts), or keywords match
 * 2. Applications: If name/description contains app keywords or is a web/mobile app
 * 3. Tools: If name/description contains tool keywords or is infrastructure-related
 * 4. Packages: Default for libraries, SDKs, and reusable components
 */
export declare function categorizeRepository(metadata: RepositoryMetadata): RepositoryCategory;
/**
 * Determines the workspace path based on category
 *
 * @param category - The repository category
 * @param repositoryName - The repository name
 * @returns The recommended workspace path
 */
export declare function getWorkspacePath(category: RepositoryCategory, repositoryName: string): string;
//# sourceMappingURL=categorization.d.ts.map
/**
 * Repository Categorization
 * Determines the appropriate category for a repository based on its characteristics
 */
/**
 * Keywords that indicate an application repository
 */
const APP_KEYWORDS = [
    'app',
    'web',
    'frontend',
    'ui',
    'dashboard',
    'portal',
    'client',
    'mobile',
    'desktop',
    'hotspot',
    'explorer',
    'interface',
];
/**
 * Keywords that indicate a package/library repository
 */
const PACKAGE_KEYWORDS = [
    'sdk',
    'lib',
    'library',
    'package',
    'utils',
    'helper',
    'component',
    'config',
    'plugin',
    'middleware',
    'service',
];
/**
 * Keywords that indicate a smart contract repository
 */
const CONTRACT_KEYWORDS = [
    'contract',
    'solidity',
    'rust',
    'program',
    'token',
    'staking',
    'rewards',
    'governance',
    'erc-20',
    'erc20',
];
/**
 * Keywords that indicate a tool/utility repository
 */
const TOOL_KEYWORDS = [
    'tool',
    'cli',
    'script',
    'automation',
    'deploy',
    'infra',
    'infrastructure',
    'devops',
    'ci',
    'cd',
];
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
export function categorizeRepository(metadata) {
    const combined = `${metadata.name} ${metadata.description} ${metadata.technologies.join(' ')}`.toLowerCase();
    // Check for smart contracts (highest priority)
    if (metadata.technologies.some((tech) => ['solidity', 'rust', 'vyper', 'cairo'].includes(tech.toLowerCase())) ||
        CONTRACT_KEYWORDS.some((keyword) => combined.includes(keyword))) {
        return 'contract';
    }
    // Check for tools/infrastructure
    if (TOOL_KEYWORDS.some((keyword) => combined.includes(keyword))) {
        return 'tool';
    }
    // Check for applications
    if (APP_KEYWORDS.some((keyword) => combined.includes(keyword))) {
        return 'app';
    }
    // Check for packages/libraries
    if (PACKAGE_KEYWORDS.some((keyword) => combined.includes(keyword))) {
        return 'package';
    }
    // Default to package for SDKs and general libraries
    if (metadata.technologies.some((tech) => ['typescript', 'javascript', 'python', 'go', 'rust'].includes(tech.toLowerCase()))) {
        return 'package';
    }
    // Final default
    return 'package';
}
/**
 * Determines the workspace path based on category
 *
 * @param category - The repository category
 * @param repositoryName - The repository name
 * @returns The recommended workspace path
 */
export function getWorkspacePath(category, repositoryName) {
    const normalizedName = repositoryName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    switch (category) {
        case 'app':
            return `apps/${normalizedName}`;
        case 'contract':
            return `contracts/${normalizedName}`;
        case 'tool':
            return `packages/${normalizedName}`;
        case 'package':
        default:
            return `packages/${normalizedName}`;
    }
}
//# sourceMappingURL=categorization.js.map
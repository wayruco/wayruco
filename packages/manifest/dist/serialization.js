/**
 * Manifest Serialization and Deserialization
 * Handles JSON read/write with validation
 */
import { z } from 'zod';
/**
 * Zod schema for validating Repository objects
 */
const RepositorySchema = z.object({
    name: z.string().min(1, 'Repository name is required'),
    source: z.string().url('Source must be a valid URL'),
    workspace: z.string().min(1, 'Workspace path is required'),
    category: z.enum(['app', 'package', 'contract', 'tool']),
    priority: z.enum(['critical', 'important', 'nice-to-have']),
    status: z.enum(['pending', 'forked', 'integrated', 'deprecated']),
    description: z.string().min(1, 'Description is required'),
    technologies: z.array(z.string()).min(1, 'At least one technology is required'),
    maintainers: z.array(z.string()),
    upstreamSync: z.object({
        enabled: z.boolean(),
        lastSync: z.string().datetime().nullable(),
        branch: z.string().min(1, 'Branch name is required'),
    }),
});
/**
 * Zod schema for validating RepositoryManifest objects
 */
const RepositoryManifestSchema = z.object({
    version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must be in semver format'),
    lastUpdated: z.string().datetime('Last updated must be a valid ISO 8601 datetime'),
    repositories: z.array(RepositorySchema),
});
/**
 * Serializes a RepositoryManifest to JSON string
 * @param manifest - The manifest to serialize
 * @returns JSON string representation
 * @throws Error if manifest is invalid
 */
export function serializeManifest(manifest) {
    // Validate before serializing
    const validated = RepositoryManifestSchema.parse(manifest);
    return JSON.stringify(validated, null, 2);
}
/**
 * Deserializes a JSON string to a RepositoryManifest
 * @param json - JSON string to deserialize
 * @returns Parsed RepositoryManifest
 * @throws Error if JSON is invalid or doesn't match schema
 */
export function deserializeManifest(json) {
    try {
        const parsed = JSON.parse(json);
        return RepositoryManifestSchema.parse(parsed);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(`Invalid manifest: ${error.message}`);
        }
        if (error instanceof SyntaxError) {
            throw new Error(`Invalid JSON: ${error.message}`);
        }
        throw error;
    }
}
/**
 * Validates a RepositoryManifest object
 * @param manifest - The manifest to validate
 * @returns true if valid, throws error otherwise
 */
export function validateManifest(manifest) {
    RepositoryManifestSchema.parse(manifest);
    return true;
}
/**
 * Validates a single Repository object
 * @param repository - The repository to validate
 * @returns true if valid, throws error otherwise
 */
export function validateRepository(repository) {
    RepositorySchema.parse(repository);
    return true;
}
//# sourceMappingURL=serialization.js.map
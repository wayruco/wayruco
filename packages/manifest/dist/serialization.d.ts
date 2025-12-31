/**
 * Manifest Serialization and Deserialization
 * Handles JSON read/write with validation
 */
import { Repository, RepositoryManifest } from './types';
/**
 * Serializes a RepositoryManifest to JSON string
 * @param manifest - The manifest to serialize
 * @returns JSON string representation
 * @throws Error if manifest is invalid
 */
export declare function serializeManifest(manifest: RepositoryManifest): string;
/**
 * Deserializes a JSON string to a RepositoryManifest
 * @param json - JSON string to deserialize
 * @returns Parsed RepositoryManifest
 * @throws Error if JSON is invalid or doesn't match schema
 */
export declare function deserializeManifest(json: string): RepositoryManifest;
/**
 * Validates a RepositoryManifest object
 * @param manifest - The manifest to validate
 * @returns true if valid, throws error otherwise
 */
export declare function validateManifest(manifest: unknown): manifest is RepositoryManifest;
/**
 * Validates a single Repository object
 * @param repository - The repository to validate
 * @returns true if valid, throws error otherwise
 */
export declare function validateRepository(repository: unknown): repository is Repository;
//# sourceMappingURL=serialization.d.ts.map
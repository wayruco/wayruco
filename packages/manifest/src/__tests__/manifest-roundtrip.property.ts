/**
 * Property-Based Test: Manifest Round-Trip Consistency
 * Feature: wayruco-monorepo-hub, Property 2: Manifest Round-Trip Consistency
 * Validates: Requirements 1.2
 *
 * For any valid repository manifest data structure, serializing to JSON and
 * deserializing back SHALL produce an equivalent data structure with all fields preserved.
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { serializeManifest, deserializeManifest } from '../serialization';
import { RepositoryManifest } from '../types';

/**
 * Arbitraries for generating test data
 */
const arbitraryRepositoryCategory = fc.oneof(
  fc.constant('app' as const),
  fc.constant('package' as const),
  fc.constant('contract' as const),
  fc.constant('tool' as const)
);

const arbitraryRepositoryPriority = fc.oneof(
  fc.constant('critical' as const),
  fc.constant('important' as const),
  fc.constant('nice-to-have' as const)
);

const arbitraryRepositoryStatus = fc.oneof(
  fc.constant('pending' as const),
  fc.constant('forked' as const),
  fc.constant('integrated' as const),
  fc.constant('deprecated' as const)
);

const arbitraryRepository = fc.record({
  name: fc.stringMatching(/^[a-z0-9-]+$/),
  source: fc.webUrl(),
  workspace: fc.stringMatching(/^[a-z0-9-/]+$/),
  category: arbitraryRepositoryCategory,
  priority: arbitraryRepositoryPriority,
  status: arbitraryRepositoryStatus,
  description: fc.string({ minLength: 1, maxLength: 500 }),
  technologies: fc.array(fc.stringMatching(/^[a-zA-Z0-9+#-]+$/), {
    minLength: 1,
    maxLength: 5,
  }),
  maintainers: fc.array(fc.emailAddress(), { maxLength: 5 }),
  upstreamSync: fc.record({
    enabled: fc.boolean(),
    lastSync: fc.oneof(
      fc.constant(null),
      fc.date({ min: new Date('2020-01-01'), max: new Date() }).map((d) => d.toISOString())
    ),
    branch: fc.stringMatching(/^[a-z0-9-/]+$/),
  }),
});

const arbitraryManifest = fc.record({
  version: fc.tuple(fc.integer({ min: 0, max: 10 }), fc.integer({ min: 0, max: 10 }), fc.integer({ min: 0, max: 10 })).map(
    ([major, minor, patch]) => `${major}.${minor}.${patch}`
  ),
  lastUpdated: fc.date({ min: new Date('2020-01-01'), max: new Date() }).map((d) => d.toISOString()),
  repositories: fc.array(arbitraryRepository, { minLength: 1, maxLength: 10 }),
});

describe('Manifest Round-Trip Consistency', () => {
  it('should preserve all fields when serializing and deserializing', () => {
    fc.assert(
      fc.property(arbitraryManifest, (originalManifest: RepositoryManifest) => {
        // Serialize to JSON
        const json = serializeManifest(originalManifest);

        // Deserialize back
        const deserializedManifest = deserializeManifest(json);

        // Verify all fields are preserved
        expect(deserializedManifest.version).toBe(originalManifest.version);
        expect(deserializedManifest.lastUpdated).toBe(originalManifest.lastUpdated);
        expect(deserializedManifest.repositories).toHaveLength(originalManifest.repositories.length);

        // Verify each repository is preserved
        deserializedManifest.repositories.forEach((repo, index) => {
          const originalRepo = originalManifest.repositories[index];
          expect(repo.name).toBe(originalRepo.name);
          expect(repo.source).toBe(originalRepo.source);
          expect(repo.workspace).toBe(originalRepo.workspace);
          expect(repo.category).toBe(originalRepo.category);
          expect(repo.priority).toBe(originalRepo.priority);
          expect(repo.status).toBe(originalRepo.status);
          expect(repo.description).toBe(originalRepo.description);
          expect(repo.technologies).toEqual(originalRepo.technologies);
          expect(repo.maintainers).toEqual(originalRepo.maintainers);
          expect(repo.upstreamSync).toEqual(originalRepo.upstreamSync);
        });
      }),
      { numRuns: 100 }
    );
  });

  it('should produce valid JSON that can be parsed', () => {
    fc.assert(
      fc.property(arbitraryManifest, (manifest: RepositoryManifest) => {
        const json = serializeManifest(manifest);

        // Should be valid JSON
        expect(() => JSON.parse(json)).not.toThrow();

        // Should be parseable back to the same structure
        const parsed = JSON.parse(json);
        expect(parsed).toHaveProperty('version');
        expect(parsed).toHaveProperty('lastUpdated');
        expect(parsed).toHaveProperty('repositories');
        expect(Array.isArray(parsed.repositories)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('should maintain data integrity through multiple round-trips', () => {
    fc.assert(
      fc.property(arbitraryManifest, (originalManifest: RepositoryManifest) => {
        // First round-trip
        const json1 = serializeManifest(originalManifest);
        const manifest1 = deserializeManifest(json1);

        // Second round-trip
        const json2 = serializeManifest(manifest1);
        const manifest2 = deserializeManifest(json2);

        // Third round-trip
        const json3 = serializeManifest(manifest2);
        const manifest3 = deserializeManifest(json3);

        // All should be identical
        expect(json1).toBe(json2);
        expect(json2).toBe(json3);
        expect(manifest1).toEqual(manifest2);
        expect(manifest2).toEqual(manifest3);
      }),
      { numRuns: 100 }
    );
  });
});

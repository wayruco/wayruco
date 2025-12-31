/**
 * Property-Based Test: Repository Categorization Consistency
 * Feature: wayruco-monorepo-hub, Property 1: Repository Categorization Consistency
 * Validates: Requirements 1.3, 2.1
 *
 * For any repository metadata containing technology stack and purpose information,
 * the categorization function SHALL deterministically assign it to exactly one of:
 * apps/, packages/, or contracts/ based on defined rules.
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { categorizeRepository, getWorkspacePath, RepositoryMetadata } from '../categorization';

/**
 * Arbitraries for generating test data
 */
const arbitraryTechnology = fc.oneof(
  fc.constant('TypeScript'),
  fc.constant('JavaScript'),
  fc.constant('Python'),
  fc.constant('Go'),
  fc.constant('Rust'),
  fc.constant('Solidity'),
  fc.constant('Vyper'),
  fc.constant('Cairo'),
  fc.stringMatching(/^[A-Z][a-z]+$/)
);

const arbitraryRepositoryMetadata = fc.record({
  name: fc.stringMatching(/^[a-z0-9-]+$/),
  description: fc.string({ minLength: 10, maxLength: 200 }),
  technologies: fc.array(arbitraryTechnology, { minLength: 1, maxLength: 5 }),
});

describe('Repository Categorization Consistency', () => {
  it('should deterministically assign repositories to exactly one category', () => {
    fc.assert(
      fc.property(arbitraryRepositoryMetadata, (metadata: RepositoryMetadata) => {
        const category = categorizeRepository(metadata);

        // Should return exactly one of the valid categories
        expect(['app', 'package', 'contract', 'tool']).toContain(category);
      }),
      { numRuns: 100 }
    );
  });

  it('should consistently categorize the same metadata', () => {
    fc.assert(
      fc.property(arbitraryRepositoryMetadata, (metadata: RepositoryMetadata) => {
        const category1 = categorizeRepository(metadata);
        const category2 = categorizeRepository(metadata);
        const category3 = categorizeRepository(metadata);

        // Should always return the same category for the same input
        expect(category1).toBe(category2);
        expect(category2).toBe(category3);
      }),
      { numRuns: 100 }
    );
  });

  it('should assign smart contracts to contract category', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.stringMatching(/^[a-z0-9-]*contract[a-z0-9-]*$/),
          description: fc.string({ minLength: 10, maxLength: 200 }),
          technologies: fc.array(
            fc.oneof(fc.constant('Solidity'), fc.constant('Rust'), fc.constant('Vyper')),
            { minLength: 1 }
          ),
        }),
        (metadata: RepositoryMetadata) => {
          const category = categorizeRepository(metadata);
          expect(category).toBe('contract');
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should assign applications to app category', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.stringMatching(/^[a-z0-9-]*(app|web|frontend|portal)[a-z0-9-]*$/),
          description: fc.string({ minLength: 10, maxLength: 200 }),
          technologies: fc.array(
            fc.oneof(fc.constant('TypeScript'), fc.constant('React'), fc.constant('Next.js')),
            { minLength: 1 }
          ),
        }),
        (metadata: RepositoryMetadata) => {
          const category = categorizeRepository(metadata);
          expect(category).toBe('app');
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should assign packages/libraries to package category', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.stringMatching(/^[a-z0-9-]*(sdk|lib|package)[a-z0-9-]*$/),
          description: fc.string({ minLength: 10, maxLength: 200 }),
          technologies: fc.array(
            fc.oneof(fc.constant('TypeScript'), fc.constant('Python'), fc.constant('Go')),
            { minLength: 1 }
          ),
        }),
        (metadata: RepositoryMetadata) => {
          const category = categorizeRepository(metadata);
          expect(category).toBe('package');
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should generate valid workspace paths for all categories', () => {
    fc.assert(
      fc.property(arbitraryRepositoryMetadata, (metadata: RepositoryMetadata) => {
        const category = categorizeRepository(metadata);
        const workspacePath = getWorkspacePath(category, metadata.name);

        // Should start with the correct prefix
        if (category === 'app') {
          expect(workspacePath).toMatch(/^apps\//);
        } else if (category === 'contract') {
          expect(workspacePath).toMatch(/^contracts\//);
        } else {
          expect(workspacePath).toMatch(/^packages\//);
        }

        // Should contain only valid characters
        expect(workspacePath).toMatch(/^[a-z0-9/-]+$/);

        // Should not have double slashes
        expect(workspacePath).not.toContain('//');
      }),
      { numRuns: 100 }
    );
  });

  it('should normalize repository names in workspace paths', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.stringMatching(/^[A-Z][a-zA-Z0-9_-]*$/),
          description: fc.string({ minLength: 10, maxLength: 200 }),
          technologies: fc.array(arbitraryTechnology, { minLength: 1 }),
        }),
        (metadata: RepositoryMetadata) => {
          const category = categorizeRepository(metadata);
          const workspacePath = getWorkspacePath(category, metadata.name);

          // Should be lowercase
          expect(workspacePath).toBe(workspacePath.toLowerCase());

          // Should not contain uppercase letters
          expect(workspacePath).not.toMatch(/[A-Z]/);
        }
      ),
      { numRuns: 100 }
    );
  });
});

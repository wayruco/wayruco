import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['src/**/*.{test,spec,property}.ts'],
        globals: true,
        environment: 'node',
    },
});

/** @type {import('next').NextConfig} */

// Determine if we're building for GitHub Pages repository path or custom domain
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';
const useRepositoryPath = process.env.USE_REPO_PATH === 'true';

// For GitHub Pages with custom domain, we should NOT use basePath
// The custom domain should serve from root, but GitHub Pages needs the CNAME file
const basePath = '';
const assetPrefix = '';

console.log('Next.js Config:', {
  isGitHubPages,
  useRepositoryPath,
  basePath,
  assetPrefix,
  note: 'Building for custom domain (wayru.co) - no basePath needed'
});

const nextConfig = {
    images: {
        domains: ['images.unsplash.com'],
        unoptimized: true,
    },
    transpilePackages: ['three'],
    output: 'export',
    trailingSlash: true,
    distDir: 'out',
    basePath: basePath,
    assetPrefix: assetPrefix,
    webpack: (config) => {
        config.externals = config.externals || [];
        config.externals.push({
            canvas: 'canvas',
        });
        return config;
    },
};

module.exports = nextConfig;

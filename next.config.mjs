export default (phase) => ({
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // Keep local development and production builds from overwriting each other.
  distDir: phase === 'phase-development-server' ? '.next-dev' : '.next',
});

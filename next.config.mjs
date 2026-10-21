import {normalizeBasePath} from './lib/paths.mjs';
export default (phase) => ({
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH || ''),
  distDir: phase === 'phase-development-server' ? '.next-dev' : '.next',
});

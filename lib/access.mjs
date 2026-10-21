// Only the homepage is the simulated entrance. Content routes stay directly accessible.
export function shouldShowPortfolio(pathname) { return pathname !== '/'; }

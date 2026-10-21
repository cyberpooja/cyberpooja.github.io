// UI-only gating: articles stay public; the entrance always starts the lab.
export function shouldShowPortfolio(pathname, unlocked) {
  if (pathname === '/') return false;
  return unlocked || pathname === '/blog' || pathname.startsWith('/blog/');
}

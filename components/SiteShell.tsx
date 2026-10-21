'use client';

import {useEffect, useState} from 'react';
import {usePathname} from 'next/navigation';
import Link from 'next/link';
import {assetPath} from '@/lib/urls';
import Header from '@/components/Header';
import {AccessContext} from '@/components/PortfolioAccess';
import {shouldShowPortfolio} from '@/lib/access.mjs';

const sessionKey = 'puja-security-assessment-complete';

export default function SiteShell({children}:{children:React.ReactNode}) {
  const pathname = usePathname();
  const [unlocked, setUnlocked] = useState(false);
  useEffect(()=>{
    try {setUnlocked(sessionStorage.getItem(sessionKey)==='true');} catch {/* In-memory access still works when storage is disabled. */}
  },[]);
  function unlock(){
    setUnlocked(true);
    try {sessionStorage.setItem(sessionKey,'true');} catch {/* Storage is optional for the simulated gate. */}
  }
  // Articles remain independently accessible and indexable. The challenge is a
  // browser simulation, not authentication or a boundary for sensitive content.
  const entrance = !shouldShowPortfolio(pathname);
  const workspace = ['/portfolio','/portfolio/','/about','/about/','/write','/write/'].includes(pathname);
  return <AccessContext.Provider value={{unlocked,unlock}}>
    {entrance||workspace ? children : <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header/>{children}
      <footer><Link className="brand" href="/portfolio/">puja<span className="muted">.sec</span></Link><span>Built with curiosity. Tested with intent.</span><div><Link href="/blog/">Writing</Link><a href={assetPath('/rss.xml')}>RSS ↗</a><span>© 2026</span></div></footer>
    </>}
  </AccessContext.Provider>;
}

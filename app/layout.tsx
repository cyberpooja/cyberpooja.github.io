import type {Metadata} from 'next';
import SiteShell from '@/components/SiteShell';
import {site} from '@/lib/site';
import {absoluteUrl} from '@/lib/urls';
import './globals.css';
export const metadata:Metadata={metadataBase:new URL(site.url),title:{default:'Pooja Pawar — Product Security Engineer',template:'%s · Pooja Pawar'},description:site.description,openGraph:{title:'Pooja Pawar — Product Security Engineer',description:site.description,type:'website'},alternates:{types:{'application/rss+xml':absoluteUrl('/rss.xml')}}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><SiteShell>{children}</SiteShell></body></html>}

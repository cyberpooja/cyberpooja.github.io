import type {Metadata} from 'next';
import SiteShell from '@/components/SiteShell';
import {site} from '@/lib/site';
import './globals.css';
export const metadata:Metadata={metadataBase:new URL(site.url),title:{default:'Puja — Mobile Security Researcher',template:'%s · Puja Security'},description:site.description,openGraph:{title:'Puja — Mobile Security Researcher',description:site.description,type:'website'},alternates:{types:{'application/rss+xml':'/rss.xml'}}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><SiteShell>{children}</SiteShell></body></html>}

import type {Metadata} from 'next';
import Header from '@/components/Header';
import {site} from '@/lib/site';
import './globals.css';
export const metadata:Metadata={metadataBase:new URL(site.url),title:{default:'Puja — Mobile Security Researcher',template:'%s · Puja Security'},description:site.description,openGraph:{title:'Puja — Mobile Security Researcher',description:site.description,type:'website'},alternates:{types:{'application/rss+xml':'/rss.xml'}}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Header/>{children}<footer><a className="brand" href="/">puja<span className="muted">.sec</span></a><span>Built with curiosity. Tested with intent.</span><div><a href="/blog/">Writing</a><a href="/rss.xml">RSS ↗</a><span>© 2026</span></div></footer></body></html>}

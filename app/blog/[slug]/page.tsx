import {posts} from '@/lib/posts';
import {site} from '@/lib/site';
import {absoluteUrl,assetPath} from '@/lib/urls';
import {notFound} from 'next/navigation';
import {MDXRemote} from 'next-mdx-remote/rsc';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import Share from '@/components/Share';
import Link from 'next/link';
export function generateStaticParams(){return posts().map(p=>({slug:p.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const p=posts().find(p=>p.slug===slug);return p?{title:p.title,description:p.description,alternates:{canonical:absoluteUrl(`/blog/${p.slug}/`)},openGraph:{type:'article',title:p.title,description:p.description,publishedTime:p.date,tags:p.tags,...(p.cover?{images:[p.cover.startsWith('https://')?p.cover:absoluteUrl(p.cover)]}:{})},twitter:{card:'summary_large_image',title:p.title,description:p.description}}:{}}
const components={
  img:({src,alt,...props}:React.ImgHTMLAttributes<HTMLImageElement>)=><img {...props} src={typeof src==='string'?assetPath(src):undefined} alt={alt||''} loading="lazy"/>,
  a:({href,children,...props}:React.AnchorHTMLAttributes<HTMLAnchorElement>)=>href?.startsWith('/')&&!href.startsWith('//')?<Link href={href}>{children}</Link>:<a {...props} href={href}>{children}</a>,
};
export default async function Article({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const p=posts().find(p=>p.slug===slug);if(!p)notFound();return <main id="main" className="article-page"><Link href="/blog/" className="text-link">← All field notes</Link><header className="article-header"><span className="eyebrow">{p.category} / {p.sample?'SAMPLE FIELD NOTE':p.kind==='research'?'RESEARCH':'ARTICLE'}</span><h1>{p.title}</h1><p>{p.description}</p><div className="article-byline">{site.name} · <time dateTime={p.date}>{p.date}</time> · {p.minutes} min read</div><div className="filters">{p.tags.map(t=><span key={t}>{t}</span>)}</div></header>{p.cover&&<img className="article-cover" src={assetPath(p.cover)} alt=""/>}<article className="prose">{p.format==='markdown'?<Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeHighlight,{ignoreMissing:true}]]} components={components}>{p.content}</Markdown>:<MDXRemote source={p.content} components={components} options={{mdxOptions:{remarkPlugins:[remarkGfm],rehypePlugins:[[rehypeHighlight,{ignoreMissing:true}]]}}}/>}</article><div className="article-end"><Share/><a href={assetPath('/rss.xml')}>Subscribe via RSS ↗</a></div><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'BlogPosting',headline:p.title,description:p.description,datePublished:p.date,author:{'@type':'Person',name:site.name},url:absoluteUrl(`/blog/${p.slug}/`)}).replace(/</g,'\\u003c')}}/></main>}

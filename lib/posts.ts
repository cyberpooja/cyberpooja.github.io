import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'yaml';
function matter(source:string){const match=source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);if(!match)throw new Error('Missing MDX frontmatter');return {data:parse(match[1]),content:match[2]};}
export type Post = {slug:string;title:string;description:string;date:string;tags:string[];category:string;minutes:number;content:string};
export function posts():Post[]{return fs.readdirSync(path.join(process.cwd(),'content/posts')).filter(f=>f.endsWith('.mdx')).map(f=>{const {data,content}=matter(fs.readFileSync(path.join(process.cwd(),'content/posts',f),'utf8'));return {...data,slug:f.replace(/\.mdx$/,''),content,minutes:Math.max(1,Math.ceil(content.split(/\s+/).length/200))} as Post}).filter(p=>!(p as any).draft).sort((a,b)=>b.date.localeCompare(a.date));}

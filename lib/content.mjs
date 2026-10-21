import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'yaml';

export function readPosts(directory = path.join(process.cwd(),'content/posts')) {
  const result=[];
  const slugs=new Set();
  for(const file of fs.readdirSync(directory).filter(name=>/\.mdx?$/.test(name))) {
    const source=fs.readFileSync(path.join(directory,file),'utf8');
    const match=source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
    if(!match)throw new Error(`${file}: missing YAML frontmatter`);
    const data=parse(match[1]);
    if(!data||typeof data!=='object')throw new Error(`${file}: invalid metadata`);
    if(data.draft===true)continue;
    for(const field of ['title','description','date','category']) {
      if(typeof data[field]!=='string'||!data[field].trim())throw new Error(`${file}: ${field} is required`);
    }
    if(!/^\d{4}-\d{2}-\d{2}$/.test(data.date)||Number.isNaN(Date.parse(data.date+'T00:00:00Z'))||new Date(data.date+'T00:00:00Z').toISOString().slice(0,10)!==data.date)throw new Error(`${file}: date must be a valid YYYY-MM-DD date`);
    if(!Array.isArray(data.tags)||!data.tags.every(t=>typeof t==='string'))throw new Error(`${file}: tags must be a list of strings`);
    const slug=file.replace(/\.mdx?$/,'');
    if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))throw new Error(`${file}: use a lowercase hyphen-separated URL slug`);
    if(slugs.has(slug))throw new Error(`Duplicate published URL: ${slug}`);
    slugs.add(slug);
    result.push({slug,title:data.title,description:data.description,date:data.date,category:data.category,tags:data.tags,kind:data.kind==='research'?'research':'article',cover:typeof data.cover==='string'?data.cover:'',sample:data.sample===true,format:file.endsWith('.mdx')?'mdx':'markdown',content:match[2],minutes:Math.max(1,Math.ceil(match[2].split(/\s+/).length/200))});
  }
  return result.sort((a,b)=>b.date.localeCompare(a.date));
}

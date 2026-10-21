import {parse,stringify} from 'yaml';
export function slugify(value){return value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,100);}
export function newDraft(){return {id:crypto.randomUUID(),title:'',subtitle:'',description:'',category:'Mobile security',tags:'',kind:'article',cover:'',date:[new Date().getFullYear(),String(new Date().getMonth()+1).padStart(2,'0'),String(new Date().getDate()).padStart(2,'0')].join('-'),slug:'',markdown:'',body:{type:'doc',content:[{type:'paragraph'}]},assets:[],extra:{},updatedAt:new Date().toISOString(),published:false};}
export function parseArticle(source){const m=source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);if(!m)throw new Error('This file does not have article metadata.');const data=parse(m[1]);if(!data||typeof data!=='object')throw new Error('Invalid article metadata.');return {metadata:data,markdown:m[2]};}
export function preparePublication(draft,{unpublish=false}={}){
 if(draft.sourcePath&&!/^content\/posts\/[a-z0-9]+(?:-[a-z0-9]+)*\.mdx?$/.test(draft.sourcePath))throw new Error('Invalid article path.');
 const slug=draft.sourcePath?draft.sourcePath.split('/').at(-1).replace(/\.mdx?$/,''):(draft.slug||slugify(draft.title));
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))throw new Error('Choose a URL using lowercase words separated by hyphens.');
 if(!draft.title.trim())throw new Error('Give your story a title.');
 if(!draft.markdown.trim())throw new Error('Your story is empty. Add some content before publishing.');
 const description=(draft.description||draft.subtitle).trim();
 if(!description)throw new Error('Add a short summary in the publish settings.');
 if(!draft.category.trim())throw new Error('Add a category in the publish settings.');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(draft.date)||Number.isNaN(Date.parse(draft.date))||new Date(draft.date).toISOString().slice(0,10)!==draft.date)throw new Error('Choose a valid publication date.');
 const sourcePath=draft.sourcePath||`content/posts/${slug}.md`;
 if(!/^content\/posts\/[a-z0-9]+(?:-[a-z0-9]+)*\.mdx?$/.test(sourcePath))throw new Error('Invalid article path.');
 let markdown=draft.markdown;let cover=draft.cover;const files=[];
 for(const image of draft.assets||[]){
  if(!markdown.includes(image.dataUrl)&&cover!==image.dataUrl)continue;
  if(!/^uploads\/[a-z0-9-]+\.(png|jpg|jpeg|webp|gif)$/.test(image.path)||!/^data:image\/(png|jpeg|webp|gif);base64,[a-zA-Z0-9+/=]+$/.test(image.dataUrl))throw new Error('An image could not be prepared. Remove and insert it again.');
  markdown=markdown.split(image.dataUrl).join('/'+image.path);if(cover===image.dataUrl)cover='/'+image.path;
  files.push({path:'public/'+image.path,content:image.dataUrl.split(',')[1],encoding:'base64'});
 }
 if(markdown.includes('data:image/')||cover.startsWith('data:'))throw new Error('An image is missing from this draft. Insert it again.');
 const metadata={...draft.extra,title:draft.title.trim(),subtitle:draft.subtitle.trim(),description,date:draft.date,category:draft.category.trim(),tags:[...new Set(draft.tags.split(',').map(t=>t.trim()).filter(Boolean))],kind:draft.kind==='research'?'research':'article',cover:cover||'',draft:unpublish};
 if(!draft.sourcePath)metadata.sample=false;
 files.push({path:sourcePath,content:`---\n${stringify(metadata).trim()}\n---\n\n${markdown.trim()}\n`,encoding:'utf-8'});
 return {files,sourcePath,slug,markdown,cover,metadata};
}

import {readPosts} from './content.mjs';
export type Post={slug:string;title:string;description:string;subtitle:string;date:string;tags:string[];category:string;kind:'article'|'research';cover:string;sample:boolean;format:'markdown'|'mdx';minutes:number;content:string};
export function posts():Post[]{return readPosts() as Post[];}

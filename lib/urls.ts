import {withBasePath} from './paths.mjs';
export function assetPath(value:string){return withBasePath(value,process.env.NEXT_PUBLIC_BASE_PATH||'');}
export function absoluteUrl(value:string){const base=(process.env.NEXT_PUBLIC_SITE_URL||'https://puja-mobile-security-lab.bonny-auk-0028.chatgpt.site').replace(/\/$/,'');return base+'/'+value.replace(/^\//,'');}

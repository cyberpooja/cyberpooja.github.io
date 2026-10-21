import Workspace from '@/components/Workspace';
import {posts} from '@/lib/posts';
import {absoluteUrl} from '@/lib/urls';
export const metadata={title:'About Pooja Pawar · Product Security Engineer',description:'Pooja Pawar, Product Security Engineer specializing in mobile application security, reverse engineering, web and API security, AI security, and vulnerability research.',alternates:{canonical:absoluteUrl('/portfolio/')}};
export default function Portfolio(){return <Workspace articles={posts().map(({slug,title,description,category,kind})=>({slug,title,description,category,kind}))}/>}

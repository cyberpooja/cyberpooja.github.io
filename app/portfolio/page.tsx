import Workspace from '@/components/Workspace';
import {posts} from '@/lib/posts';
export const metadata={title:'About Pooja Pawar · Product Security Engineer',description:'Pooja Pawar, Product Security Engineer specializing in mobile application security, reverse engineering, web and API security, and vulnerability research.',alternates:{canonical:'/portfolio/'}};
export default function Portfolio(){return <Workspace articles={posts().map(({slug,title,description,category})=>({slug,title,description,category}))}/>}

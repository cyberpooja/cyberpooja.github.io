import Workspace from '@/components/Workspace';
import {posts} from '@/lib/posts';
export const metadata={title:'About · Researcher workspace',description:'Explore the person behind the research, the tools, and the stories.',alternates:{canonical:'/portfolio/'}};
export default function Portfolio(){return <Workspace articles={posts().map(({slug,title,description,category})=>({slug,title,description,category}))}/>}

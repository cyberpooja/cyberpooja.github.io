import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import {TableKit} from '@tiptap/extension-table';
import {Markdown} from '@tiptap/markdown';
import {common,createLowlight} from 'lowlight';
import {withBasePath} from '../paths.mjs';
const assetPath=value=>withBasePath(value,process.env.NEXT_PUBLIC_BASE_PATH||'');
const lowlight=createLowlight(common);
const StudioImage=Image.extend({renderHTML({HTMLAttributes}){return ['img',{...HTMLAttributes,src:assetPath(HTMLAttributes.src),loading:'lazy'}];}});
export function studioExtensions(){return [StarterKit.configure({codeBlock:false,heading:{levels:[2,3]},link:{openOnClick:false,autolink:true},underline:false}),StudioImage.configure({allowBase64:true}),Placeholder.configure({placeholder:'Tell your story… Type / for blocks, or select text to format.'}),CodeBlockLowlight.configure({lowlight,defaultLanguage:'plaintext'}),TaskList,TaskItem.configure({nested:true}),TableKit.configure({table:{resizable:false}}),Markdown];}

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import Image from '@tiptap/extension-image';
import { indexedDB, IDBKeyRange } from 'fake-indexeddb';
import { createStore, set, get } from 'idb-keyval';

test('formatted writing and images survive a saved draft and Markdown round trip',async()=>{
  const window=new Window({url:'https://writer.test'});
  for(const key of ['window','document','navigator','Node','HTMLElement','Element','MutationObserver','DOMParser','getComputedStyle'])
    Object.defineProperty(globalThis,key,{value:(window as any)[key]??window,writable:true,configurable:true});
  Object.assign(globalThis,{indexedDB,IDBKeyRange});
  const editor=new Editor({extensions:[StarterKit,Image.configure({allowBase64:true}),Markdown],content:'<p>First paragraph.</p>'});
  editor.commands.setContent({type:'doc',content:[
    {type:'heading',attrs:{level:2},content:[{type:'text',text:'A heading'}]},
    {type:'paragraph',content:[{type:'text',text:'Bold words',marks:[{type:'bold'}]},{type:'text',text:' and normal text.'}]},
    {type:'codeBlock',attrs:{language:'js'},content:[{type:'text',text:'const value = "<script>";'}]},
    {type:'image',attrs:{src:'/uploads/photo.png',alt:'A useful diagram'}}
  ]});
  const store=createStore('writer-test','drafts');await set('draft',editor.getJSON(),store);
  const saved=await get('draft',store);assert.deepEqual(saved,JSON.parse(JSON.stringify(editor.getJSON())));
  const md=editor.getMarkdown();assert.match(md,/\*\*Bold words\*\*/);assert.match(md,/!\[A useful diagram\]\(\/uploads\/photo.png\)/);
  editor.commands.setContent(md,{contentType:'markdown'});
  assert.match(editor.getHTML(),/<strong>Bold words<\/strong>/);assert.match(editor.getHTML(),/&lt;script&gt;/);
  assert.equal(editor.getJSON().content?.find(n=>n.type==='image')?.attrs?.alt,'A useful diagram');
  editor.destroy();await window.happyDOM.close();
});

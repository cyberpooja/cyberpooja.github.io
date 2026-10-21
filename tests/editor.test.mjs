import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {Window} from 'happy-dom';
const window=new Window({url:'https://cyberpooja.github.io/write/'});
for(const key of ['window','document','navigator','Node','HTMLElement','Element','Text','DOMParser','MutationObserver','ShadowRoot','DocumentFragment','KeyboardEvent','MouseEvent','Event','getComputedStyle','requestAnimationFrame','cancelAnimationFrame']){
 const value=key==='window'?window:typeof window[key]==='function'&&['getComputedStyle','requestAnimationFrame','cancelAnimationFrame'].includes(key)?window[key].bind(window):window[key];
 Object.defineProperty(globalThis,key,{value,configurable:true,writable:true});
}
Object.defineProperty(globalThis,'innerHeight',{value:900,configurable:true});
const {Editor}=await import('@tiptap/core');
const {studioExtensions}=await import('../lib/studio/extensions.mjs');
after(()=>window.happyDOM.abort());
function editor(t,content){const instance=new Editor({element:document.createElement('div'),extensions:studioExtensions(),content,contentType:'markdown'});t.after(()=>instance.destroy());return instance;}
test('technical articles round-trip headings, highlighted code, links, lists, quotes and tables',t=>{
 const content='## A finding\n\nSome **important** text and `inline()` code.\n\n```python\nprint("hello")\n```\n\n[Reference](https://example.com)\n\n> Follow the trust boundary.\n\n- First\n- Second\n\n| Check | Result |\n| --- | --- |\n| Root | Bypassed |';
 const instance=editor(t,content);const markdown=instance.getMarkdown();
 for(const piece of ['## A finding','**important**','`inline()`','```python','print("hello")','https://example.com','Follow the trust boundary.','Root','Bypassed'])assert(markdown.includes(piece),piece+' missing from '+markdown);
 const nodes=instance.getJSON().content;assert(nodes.some(n=>n.type==='codeBlock'&&n.attrs.language==='python'));assert(nodes.some(n=>n.type==='table'));assert(instance.getHTML().includes('hljs')||instance.view.dom.querySelector('.hljs-string'));
 const restored=editor(t,markdown);assert.equal(restored.getText().replace(/\s+/g,' '),instance.getText().replace(/\s+/g,' '));
});
test('uploaded images retain their data until publication can replace them with repository URLs',t=>{
 const instance=editor(t,'A figure below.');instance.commands.insertContent({type:'image',attrs:{src:'data:image/png;base64,YWJj',alt:'Lab diagram'}});
 const markdown=instance.getMarkdown();assert(markdown.includes('data:image/png;base64,YWJj'));assert(markdown.includes('Lab diagram'));
 const restored=editor(t,markdown);assert(restored.getJSON().content.some(n=>n.type==='image'));
});
test('editing transactions support undo and preserve code as literal text',t=>{
 const instance=editor(t,'Start');instance.commands.insertContent(' new text');assert(instance.getText().includes('new text'));assert(instance.commands.undo());assert.equal(instance.getText(),'Start');
 instance.commands.setContent('```javascript\nconst template = "<script> & {value}";\n```',{contentType:'markdown'});
 assert(instance.getMarkdown().includes('<script> & {value}'));assert(!instance.view.dom.querySelector('script'));
});

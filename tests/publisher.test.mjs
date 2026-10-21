import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createPublisher} from '../lib/studio/github.mjs';
import {newDraft,parseArticle,preparePublication} from '../lib/studio/document.mjs';
const filled=()=>({...newDraft(),title:'API trust boundaries',description:'What to validate on the server',tags:'API, API, Android',markdown:'A useful research finding.',kind:'research'});
test('publication exports validated metadata and only referenced images in one batch',()=>{
 const draft=filled();const image={path:'uploads/test-image.png',dataUrl:'data:image/png;base64,YWJj'};draft.assets=[image,{path:'uploads/unused.png',dataUrl:'data:image/png;base64,ZGVm'}];draft.markdown+='\n![Evidence]('+image.dataUrl+')';draft.cover=image.dataUrl;
 const plan=preparePublication(draft);assert.equal(plan.files.length,2);assert.equal(plan.sourcePath,'content/posts/api-trust-boundaries.md');assert.equal(plan.cover,'/uploads/test-image.png');assert(plan.markdown.includes('/uploads/test-image.png'));assert(!plan.markdown.includes('data:'));
 const data=parseArticle(plan.files.at(-1).content);assert.deepEqual(data.metadata.tags,['API','Android']);assert.equal(data.metadata.kind,'research');assert.equal(data.metadata.draft,false);
 assert.equal(parseArticle(preparePublication(draft,{unpublish:true}).files.at(-1).content).metadata.draft,true);
});
test('edits preserve the existing URL and fail on missing metadata or unexpected paths',()=>{
 const d=filled();d.sourcePath='content/posts/stable-name.mdx';d.slug='new-title';assert.equal(preparePublication(d).sourcePath,d.sourcePath);
 assert.throws(()=>preparePublication({...d,sourcePath:'.github/workflows/new.yml'}),/Invalid article path/);
 for(const patch of [{title:''},{markdown:''},{description:'',subtitle:''},{date:'2026-02-31'},{sourcePath:undefined,slug:'../file'}])assert.throws(()=>preparePublication({...d,...patch}));
});
function fake(options={}){const calls=[];const fetcher=async(url,request={})=>{const pathname=new URL(url).pathname;const body=request.body?JSON.parse(request.body):undefined;calls.push({pathname,method:request.method||'GET',body,headers:request.headers});let data={};let status=200;
 if(pathname.endsWith('/git/ref/heads/main'))data={object:{sha:'head'}};
 else if(pathname.includes('/contents/')){if(options.existing)data={sha:options.existing};else status=404;}
 else if(pathname.endsWith('/git/commits/head'))data={tree:{sha:'base-tree'}};
 else if(pathname.endsWith('/git/blobs'))data={sha:'article-blob'};
 else if(pathname.endsWith('/git/trees'))data={sha:'new-tree'};
 else if(pathname.endsWith('/git/commits'))data={sha:'commit'};
 else if(pathname.endsWith('/git/refs/heads/main')){if(options.branchMoved)status=422;else data={object:{sha:'commit'}};}
 return new Response(JSON.stringify(data),{status});};return {calls,api:createPublisher({token:'test-token',repository:'owner/blog',fetcher})};}
const publication={sourcePath:'content/posts/test.md',files:[{path:'content/posts/test.md',content:'story',encoding:'utf-8'}],message:'Publish'};
test('publishing creates an atomic tree and advances the branch without force',async()=>{
 const{api,calls}=fake();const result=await api.publish(publication);assert.equal(result.sourceSha,'article-blob');const change=calls.at(-1);assert.equal(change.method,'PATCH');assert.equal(change.body.force,false);assert.deepEqual(calls.find(c=>c.pathname.endsWith('/git/commits')&&c.method==='POST').body.parents,['head']);assert.deepEqual(calls.find(c=>c.pathname.endsWith('/git/trees')).body.base_tree,'base-tree');
});
test('duplicate slugs, stale edits and branch races never overwrite newer content',async()=>{
 for(const sourceSha of [undefined,'old-version']){const{api,calls}=fake({existing:'new-version'});await assert.rejects(()=>api.publish({...publication,sourceSha}),/different version already exists/);assert(!calls.some(c=>c.method==='POST'||c.method==='PATCH'));}
 const moved=fake({branchMoved:true});await assert.rejects(()=>moved.api.publish(publication),/repository changed/);assert.equal(moved.calls.at(-1).body.force,false);
 const removed=fake();await assert.rejects(()=>removed.api.publish({...publication,sourceSha:'removed-file'}),/removed from GitHub/);
});
test('unauthenticated writes and files outside the article/upload folders are rejected',async()=>{
 const api=createPublisher({repository:'owner/blog',fetcher:()=>{throw new Error('Must not make a request')}});
 await assert.rejects(()=>api.publish(publication),/Connect GitHub/);
 const{api:connected,calls}=fake();await assert.rejects(()=>connected.publish({...publication,files:[...publication.files,{path:'.github/workflows/steal.yml',content:'no',encoding:'utf-8'}]}),/unexpected file path/);assert.equal(calls.length,0);
});

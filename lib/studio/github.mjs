export function createPublisher({token,repository,branch='main',fetcher=fetch}){
 if(!/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repository)||!/^[-a-zA-Z0-9_./]+$/.test(branch))throw new Error('Invalid publishing repository.');
 const root=`https://api.github.com/repos/${repository}`;
 async function request(path,options={},missing=false){
  const response=await fetcher(path.startsWith('/user')?'https://api.github.com/user':root+path,{...options,headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',...(token?{Authorization:`Bearer ${token}`}:{}) ,...(options.body?{'Content-Type':'application/json'}:{})},cache:'no-store'});
  if(missing&&response.status===404)return null;
  if(!response.ok){if(response.status===401)throw new Error('GitHub access has expired. Reconnect in the Account panel.');if(response.status===403)throw new Error('GitHub denied this action. Check Contents read/write permission and rate limits.');if(response.status===409||response.status===422)throw new Error('The repository changed while publishing. Reopen the latest version before trying again.');throw new Error(`GitHub request failed (${response.status}). No publication was confirmed.`);}
  return response.json();
 }
 const apiPath=path=>path.split('/').map(encodeURIComponent).join('/');
 return {
  async connect(){const user=await request('/user');const repo=await request('');if(repo.permissions?.push===false)throw new Error('This account does not have write access to the portfolio.');return {login:user.login,avatar:user.avatar_url};},
  async list(){const files=await request(`/contents/content/posts?ref=${encodeURIComponent(branch)}`);return files.filter(f=>/\.mdx?$/.test(f.name)&&f.type==='file');},
  async read(path){if(!/^content\/posts\/[a-z0-9-]+\.mdx?$/.test(path))throw new Error('Invalid article path.');const file=await request(`/contents/${apiPath(path)}?ref=${encodeURIComponent(branch)}`);const bytes=Uint8Array.from(atob(file.content.replace(/\s/g,'')),c=>c.charCodeAt(0));return {...file,text:new TextDecoder().decode(bytes)};},
  async publish({files,sourcePath,sourceSha,message}){
   if(!token)throw new Error('Connect GitHub to publish. Your draft is saved on this device.');
   if(!files.length||!files.some(f=>f.path===sourcePath))throw new Error('Publication has no article.');
   for(const file of files)if(!/^content\/posts\/[a-z0-9-]+\.mdx?$/.test(file.path)&&!/^public\/uploads\/[a-z0-9-]+\.(png|jpg|jpeg|webp|gif)$/.test(file.path))throw new Error('Publication contains an unexpected file path.');
   const ref=await request(`/git/ref/heads/${apiPath(branch)}`);const head=ref.object.sha;
   const current=await request(`/contents/${apiPath(sourcePath)}?ref=${head}`,{},true);
   if(current&&(!sourceSha||current.sha!==sourceSha))throw new Error('A different version already exists at this URL. Reopen the published story or choose another URL.');
   if(!current&&sourceSha)throw new Error('This article was removed from GitHub. Reload it before publishing.');
   const parent=await request(`/git/commits/${head}`);const tree=[];
   for(const file of files){const blob=await request('/git/blobs',{method:'POST',body:JSON.stringify({content:file.content,encoding:file.encoding})});tree.push({path:file.path,mode:'100644',type:'blob',sha:blob.sha});}
   const created=await request('/git/trees',{method:'POST',body:JSON.stringify({base_tree:parent.tree.sha,tree})});
   const commit=await request('/git/commits',{method:'POST',body:JSON.stringify({message,tree:created.sha,parents:[head]})});
   await request(`/git/refs/heads/${apiPath(branch)}`,{method:'PATCH',body:JSON.stringify({sha:commit.sha,force:false})});
   return {commit:commit.sha,sourceSha:tree.find(f=>f.path===sourcePath).sha,url:`https://github.com/${repository}/actions`};
  },
 };
}

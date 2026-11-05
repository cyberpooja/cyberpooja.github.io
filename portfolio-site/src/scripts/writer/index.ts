import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import BubbleMenu from '@tiptap/extension-bubble-menu';
import { Markdown } from '@tiptap/markdown';
import { createStore, get, set, values } from 'idb-keyval';
import { newStory, parseStory, REPO, sections, type Story, type Section } from './model';
import { GitHub } from './github';

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const title = $<HTMLTextAreaElement>('story-title');
const store = createStore('puja-writing', 'stories');
let story = newStory(), ready = false, busy = false, preview = false, dirty = false;
let github: GitHub | undefined, login = '', revision = 0, saveTimer: ReturnType<typeof setTimeout>;
let savedSelection = { from: 1, to: 1 };
const dialog = (id: string) => $<HTMLDialogElement>(id);
let noticeTimer: ReturnType<typeof setTimeout>;
function notify(message: string) { $('notice').textContent = message; $('notice').hidden = false; clearTimeout(noticeTimer); noticeTimer = setTimeout(() => $('notice').hidden = true, 6500); }
function errorText(error: unknown) { return error instanceof Error ? error.message : 'Something went wrong. Your draft has not been discarded.'; }
function resizeTitle() { title.style.height = 'auto'; title.style.height = `${title.scrollHeight}px`; }
function rememberSelection() { savedSelection = { from: editor.state.selection.from, to: editor.state.selection.to }; }
function focusSelection() { return editor.chain().focus().setTextSelection(savedSelection); }
const editor = new Editor({ element: $('editor'), extensions: [
  StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false, protocols: ['https', 'http', 'mailto'] } }),
  Placeholder.configure({ placeholder: 'Tell your story…' }), Image.configure({ allowBase64: true }), Markdown,
  BubbleMenu.configure({ element: $('bubble-menu') })
], editorProps: { attributes: { 'aria-label': 'Story body', role: 'textbox', 'aria-multiline': 'true', spellcheck: 'true' },
  handlePaste(_view, event) {
    const image = Array.from(event.clipboardData?.files ?? []).find(file => file.type.startsWith('image/'));
    if (image) { event.preventDefault(); void insertFile(image, image.name); return true; } return false;
  },
  handleDrop(_view, event) {
    const image = Array.from(event.dataTransfer?.files ?? []).find(file => file.type.startsWith('image/'));
    if (image) { event.preventDefault(); void insertFile(image, image.name); return true; } return false;
  }
}, onUpdate: () => changed(), onSelectionUpdate: () => {
  if (!ready) return;
  const { $from } = editor.state.selection;
  try { const coords = editor.view.coordsAtPos($from.start()); const box = $('editor').getBoundingClientRect(); $('insert-button').style.top = `${Math.max(0, coords.top - box.top)}px`; } catch {}
  for (const button of document.querySelectorAll<HTMLButtonElement>('#bubble-menu [data-command]')) {
    const command = button.dataset.command!;
    const active = command === 'h2' || command === 'h3' ? editor.isActive('heading', { level: Number(command[1]) }) : editor.isActive(command === 'quote' ? 'blockquote' : command);
    button.setAttribute('aria-pressed', String(active));
  }
}});
function changed() {
  if (!ready) return;
  dirty = true; revision++; $('save-status').textContent = 'Saving…';
  const count = editor.getText().trim().split(/\s+/).filter(Boolean).length;
  $('word-count').textContent = `${count} words · ${Math.max(1, Math.ceil(count / 200))} min read`;
  clearTimeout(saveTimer); saveTimer = setTimeout(() => void persist(), 300);
}
async function persist() {
  if (!ready) return false;
  clearTimeout(saveTimer);
  const currentRevision = revision;
  const snapshot: Story = { ...story, title: title.value, content: editor.getJSON(), updated: Date.now() };
  try {
    await set(snapshot.id, snapshot, store);
    localStorage.setItem('puja-current-story', snapshot.id);
    if (story.id === snapshot.id) story = snapshot;
    if (currentRevision === revision) { dirty = false; $('save-status').textContent = 'Saved on this device'; }
    return true;
  } catch { $('save-status').textContent = 'Could not save — download a backup'; notify('Browser storage is unavailable or full. Download your draft from the ••• menu.'); return false; }
}
function load(next: Story) {
  ready = false; story = next; title.value = next.title; editor.commands.setContent(next.content); ready = true;
  preview = false; editor.setEditable(true); title.readOnly = false; title.disabled = false; $('writing-page').classList.remove('previewing'); $('preview-button').textContent = 'Preview';
  resizeTitle(); changed();
}
async function start() {
  try { const id = localStorage.getItem('puja-current-story'); const previous = id ? await get<Story>(id, store) : undefined; load(previous ?? story); }
  catch { load(story); notify('Your browser could not restore drafts. Use Download draft backup to keep a copy.'); }
}
void start();
title.addEventListener('input', () => { resizeTitle(); changed(); });
title.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); editor.commands.focus('start'); } });
window.addEventListener('resize', resizeTitle);
window.addEventListener('beforeunload', event => { if (dirty || busy) { event.preventDefault(); event.returnValue = ''; } });
document.addEventListener('visibilitychange', () => { if (document.hidden && dirty) void persist(); });
document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); void persist(); }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k' && editor.isFocused) { event.preventDefault(); openLink(); }
  if (event.key === 'Escape') { $('insert-menu').hidden = true; $('insert-button').setAttribute('aria-expanded','false'); $('more-menu').hidden = true; $('more-button').setAttribute('aria-expanded','false'); }
});
for (const button of document.querySelectorAll<HTMLElement>('[data-close]')) button.onclick = () => { if (!busy) button.closest('dialog')?.close(); };
for (const d of document.querySelectorAll('dialog')) d.addEventListener('cancel', event => { if (busy) event.preventDefault(); });
$('more-button').onclick = () => { $('more-menu').hidden = !$('more-menu').hidden; $('more-button').setAttribute('aria-expanded',String(!$('more-menu').hidden)); };
$('theme-button').onclick = () => { const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = theme; try { localStorage.setItem('writer-theme',theme); } catch {} };
$('insert-button').onmousedown = event => event.preventDefault();
$('insert-button').onclick = () => { if (busy || preview) return; rememberSelection(); $('insert-menu').hidden = !$('insert-menu').hidden; $('insert-button').setAttribute('aria-expanded',String(!$('insert-menu').hidden)); };
function openLink() { rememberSelection(); $<HTMLInputElement>('link-url').value = editor.getAttributes('link').href ?? ''; dialog('link-dialog').showModal(); }
const actions: Record<string, () => void> = {
  bold: () => { editor.chain().focus().toggleBold().run(); }, italic: () => { editor.chain().focus().toggleItalic().run(); },
  h2: () => { editor.chain().focus().toggleHeading({level:2}).run(); }, h3: () => { editor.chain().focus().toggleHeading({level:3}).run(); },
  quote: () => { editor.chain().focus().toggleBlockquote().run(); }, code: () => { editor.chain().focus().toggleCode().run(); },
  codeBlock: () => { editor.chain().focus().toggleCodeBlock().run(); }, bulletList: () => { editor.chain().focus().toggleBulletList().run(); },
  divider: () => { editor.chain().focus().setHorizontalRule().run(); }, link: openLink,
  image: () => { rememberSelection(); dialog('image-dialog').showModal(); }
};
for (const button of document.querySelectorAll<HTMLButtonElement>('[data-command]')) {
  button.onmousedown = e => e.preventDefault();
  button.onclick = () => { if (busy) return; actions[button.dataset.command!]?.(); $('insert-menu').hidden = true; $('insert-button').setAttribute('aria-expanded','false'); };
}
$('link-form').onsubmit = event => { event.preventDefault(); const url = $<HTMLInputElement>('link-url').value.trim();
  if (url && !/^https?:\/\//i.test(url)) { notify('Use a link starting with https:// or http://.'); return; }
  const chain = focusSelection().extendMarkRange('link'); url ? chain.setLink({href:url}).run() : chain.unsetLink().run(); dialog('link-dialog').close();
};
$('unlink-button').onclick = () => { focusSelection().extendMarkRange('link').unsetLink().run(); dialog('link-dialog').close(); };
async function insertFile(file: File, alt: string) {
  if (busy || preview) return;
  if (!['image/png','image/jpeg','image/webp','image/gif'].includes(file.type) || file.size > 5 * 1024 * 1024) { notify('Choose a PNG, JPEG, WebP, or GIF under 5 MB.'); return; }
  const storyId = story.id; const reader = new FileReader(); reader.onload = () => { if (story.id !== storyId || busy) { notify('Please insert the image again in the current story.'); return; } editor.chain().focus().setImage({src:String(reader.result),alt}).run(); }; reader.onerror = () => notify('Could not read this image.'); reader.readAsDataURL(file);
}
$('image-form').onsubmit = event => { event.preventDefault(); const file = $<HTMLInputElement>('image-file').files?.[0]; if (!file) return; focusSelection().run(); void insertFile(file,$<HTMLInputElement>('image-alt').value); dialog('image-dialog').close(); };
$('preview-button').onclick = () => { if (busy) return; preview = !preview; editor.setEditable(!preview); title.readOnly = preview; $('writing-page').classList.toggle('previewing',preview); $('preview-button').textContent = preview ? 'Continue editing' : 'Preview'; $('insert-menu').hidden = true; };
async function fresh() { if (busy) return; if (!(await persist())) return; load(newStory()); dialog('stories-dialog').close(); $('more-menu').hidden = true; title.focus(); }
$('new-button').onclick = () => void fresh(); $('new-story').onclick = () => void fresh();
function downloadDraft() {
  const snapshot = { ...story, title:title.value, content:editor.getJSON() };
  const url = URL.createObjectURL(new Blob([JSON.stringify(snapshot,null,2)],{type:'application/json'}));
  const link = document.createElement('a'); link.href=url; link.download=`story-${story.id}.json`; link.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
}
$('export-button').onclick = downloadDraft;
$('import-button').onclick = () => $<HTMLInputElement>('import-file').click();
$('import-file').onchange = async () => {
  if (busy) return;
  const file = $<HTMLInputElement>('import-file').files?.[0]; if (!file) return;
  try { if (file.size > 25 * 1024 * 1024) throw new Error('Backup is too large.'); const data = JSON.parse(await file.text());
    if (typeof data.title !== 'string' || data.content?.type !== 'doc' || !sections.includes(data.section)) throw new Error('This is not a supported story backup.');
    if (!(await persist())) return;
    // Restore as a new draft: a backup must never overwrite a published story accidentally.
    load({...newStory(), title:data.title, content:data.content, section:data.section, description:String(data.description ?? ''), category:String(data.category ?? 'Web Security'), tags:String(data.tags ?? ''), repoUrl:String(data.repoUrl ?? '')}); notify('Backup restored as a new draft.');
  } catch (error) { notify(errorText(error)); }
};
function connectDialog() { $('connect-error').textContent = ''; dialog('connect-dialog').showModal(); }
$('connect-button').onclick = connectDialog; $('publish-connect').onclick = connectDialog;
$('disconnect-button').onclick = () => { github = undefined; login = ''; updateConnection(); notify('Disconnected. Your local drafts are still saved.'); };
function updateConnection() { $('connection-status').textContent = github ? `Publishing as ${login}` : 'Connect GitHub to publish. You can keep writing without signing in.'; $('publish-connect').hidden = !!github; $('disconnect-button').hidden = !github; $('connect-button').textContent = github ? `Connected as ${login}` : 'Connect GitHub'; }
$('connect-form').onsubmit = async event => { event.preventDefault(); const input=$<HTMLInputElement>('access-token'); const client = new GitHub(input.value.trim()); input.value=''; const button=$('connect-form').querySelector<HTMLButtonElement>('[type=submit]')!; button.disabled=true;
  try { login=await client.connect(); github=client; updateConnection(); dialog('connect-dialog').close(); notify(`Connected as ${login}.`); }
  catch(error){ $('connect-error').textContent=errorText(error); } finally {button.disabled=false;}
};
function fieldsToStory() { story.section=$<HTMLSelectElement>('section').value as Section; story.description=$<HTMLTextAreaElement>('description').value; story.category=$<HTMLInputElement>('category').value; story.tags=$<HTMLInputElement>('tags').value; story.repoUrl=$<HTMLInputElement>('repo-url').value; changed(); }
for (const id of ['section','description','category','tags','repo-url']) $(id).addEventListener('input',()=> { fieldsToStory(); $('repo-field').hidden=story.section!=='tools'; });
$('publish-button').onclick = async () => {
  if(busy) return;
  await persist();
  $<HTMLSelectElement>('section').value=story.section; $<HTMLSelectElement>('section').disabled=!!story.path;
  $<HTMLTextAreaElement>('description').value=story.description || editor.getText().replace(/\s+/g,' ').slice(0,180);
  $<HTMLInputElement>('category').value=story.category; $<HTMLInputElement>('tags').value=story.tags; $<HTMLInputElement>('repo-url').value=story.repoUrl;
  $('repo-field').hidden=story.section!=='tools'; $('publish-error').textContent=''; $('published-result').hidden=true;
  $('confirm-publish').textContent=story.sha?'Publish update':'Publish story'; updateConnection(); dialog('publish-dialog').showModal();
};
$('publish-form').onsubmit = async event => {
  event.preventDefault(); if(busy) return; if(!github){connectDialog();return;}
  fieldsToStory(); if(!(await persist())) return;
  if(!title.value.trim() || editor.isEmpty){$('publish-error').textContent='Add a title and a story first.';return;}
  busy=true; editor.setEditable(false); title.disabled=true; for (const field of $('publish-form').querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input,select,textarea')) field.disabled=true; $('publish-error').textContent='';
  const button=$<HTMLButtonElement>('confirm-publish'); button.disabled=true; button.textContent='Publishing…';
  const snapshot: Story=structuredClone(story);
  try {
    // Upload images only when publishing. Keep the draft unchanged if a request fails.
    let markdown=editor.getMarkdown(); const images=new Set<string>();
    function collect(node:any){if(node.type==='image' && node.attrs?.src?.startsWith('data:'))images.add(node.attrs.src);node.content?.forEach(collect);}
    collect(snapshot.content); const replacements=new Map<string,string>();
    for(const image of images){const path=await github.image(image);replacements.set(image,path);markdown=markdown.split(image).join(path);}
    const result=await github.publish(snapshot,markdown);
    function replace(node:any){if(node.type==='image' && replacements.has(node.attrs?.src))node.attrs.src=replacements.get(node.attrs.src);node.content?.forEach(replace);}
    replace(snapshot.content); story={...snapshot,path:result.path,sha:result.sha,publishedAt:snapshot.publishedAt??new Date().toISOString()};
    editor.commands.setContent(story.content); await persist(); $('published-result').hidden=false;
    $<HTMLAnchorElement>('deployment-link').href=`https://github.com/${REPO}/actions`;
    $<HTMLAnchorElement>('story-link').href=`/${story.section}/${result.path.split('/').pop()!.replace(/\.md$/,'')}/`;
    notify('Story sent to GitHub. Deployment is starting.');
  }catch(error){$('publish-error').textContent=errorText(error);}
  finally{busy=false;editor.setEditable(!preview);title.disabled=false; for (const field of $('publish-form').querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input,select,textarea')) field.disabled=false; $<HTMLSelectElement>('section').disabled=!!story.path; button.disabled=false;button.textContent=story.sha?'Publish update':'Publish story';}
};
async function showStories(remote=false){
  if(busy)return; if(!(await persist()))return;
  if(!dialog('stories-dialog').open)dialog('stories-dialog').showModal();
  $('local-tab').classList.toggle('active',!remote);$('published-tab').classList.toggle('active',remote);
  $('stories-list').replaceChildren();$('stories-note').textContent=remote?'Published stories from your site. Connect GitHub to load and edit them.':'Drafts saved on this browser. Download backups to keep a copy elsewhere.';
  try {
    if(remote && !github){const b=document.createElement('button');b.textContent='Connect GitHub';b.onclick=connectDialog;$('stories-list').append(b);return;}
    const items=remote?await github!.list():(await values<Story>(store)).filter(s=>s.title.trim() || s.content?.content?.some((n:any)=>n.content?.length || n.type==='image')).sort((a,b)=>b.updated-a.updated);
    if(!items.length){const p=document.createElement('p');p.className='empty-stories';p.textContent=remote?'No published stories yet. Your first story starts here.':'Your drafts will appear here as you write.';$('stories-list').append(p);return;}
    for(const item of items){
      const row=document.createElement('div');row.className='story-row'; const button=document.createElement('button'); const heading=document.createElement('strong'); heading.textContent=remote?item.name.replace(/\.md$/,'').replaceAll('-',' '):item.title||'Untitled story';
      const caption=document.createElement('small');caption.textContent=remote?item.section:`${item.sha?'Published · local copy':'Draft'} · ${new Date(item.updated).toLocaleDateString()}`;button.append(heading,caption);
      button.onclick=async()=>{try{
        if(remote){const existing=(await values<Story>(store)).find(s=>s.path===item.path); if(existing && !confirm('Loading the published version may replace local edits to this story. Continue?'))return;
          const file=await github!.read(item.path);const parsed=parseStory(file.text);const m=parsed.metadata;
          load({...newStory(),id:existing?.id??crypto.randomUUID(),title:String(m.title??''),content:editor.markdown!.parse(parsed.markdown),section:item.section,description:String(m.description??''),category:String(m.category??''),tags:Array.isArray(m.tags)?m.tags.join(', '):'',repoUrl:String(m.repoUrl??''),metadata:m,path:item.path,sha:file.sha,publishedAt:String(m.pubDate??'')});
        }else load(item);dialog('stories-dialog').close();
      }catch(error){notify(errorText(error));}};
      row.append(button);$('stories-list').append(row);
    }
  }catch(error){$('stories-note').textContent=errorText(error);}
}
$('stories-button').onclick=()=>void showStories();$('local-tab').onclick=()=>void showStories();$('published-tab').onclick=()=>void showStories(true);

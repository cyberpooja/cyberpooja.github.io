import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {readPosts} from '../lib/content.mjs';
import {withBasePath,normalizeBasePath} from '../lib/paths.mjs';
const frontmatter='title: A finding\ndescription: A useful summary\ndate: "2026-10-22"\ncategory: Android\ntags: [Android, Frida]\n';
function fixture(t){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'portfolio-content-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));return dir;}
test('CMS Markdown and original MDX load together; drafts never leave the content layer',t=>{
 const dir=fixture(t);
 fs.writeFileSync(path.join(dir,'new-research.md'),`---\n${frontmatter}kind: research\ncover: /uploads/test.png\n---\nA {literal} story with <technical> notation.\n`);
 fs.writeFileSync(path.join(dir,'old-article.mdx'),`---\n${frontmatter}sample: true\n---\n## Existing article`);
 fs.writeFileSync(path.join(dir,'draft.md'),'---\ndraft: true\n---\nPrivate working notes');
 const items=readPosts(dir);assert.equal(items.length,2);assert(!JSON.stringify(items).includes('Private working notes'));
 const research=items.find(p=>p.kind==='research');assert.equal(research.format,'markdown');assert.equal(research.cover,'/uploads/test.png');assert(research.content.includes('{literal}'));
 assert.equal(items.find(p=>p.format==='mdx').sample,true);
});
test('publication rejects duplicate URLs and invalid metadata with a clear error',t=>{
 const dir=fixture(t);for(const ext of ['md','mdx'])fs.writeFileSync(path.join(dir,`same.${ext}`),`---\n${frontmatter}---\nText`);
 assert.throws(()=>readPosts(dir),/Duplicate published URL/);fs.unlinkSync(path.join(dir,'same.mdx'));
 fs.writeFileSync(path.join(dir,'same.md'),`---\n${frontmatter.replace('2026-10-22','2026-02-31')}---\nText`);assert.throws(()=>readPosts(dir),/date must be a valid/);
});
test('GitHub project URLs prefix assets once without touching external URLs or hash links',()=>{
 for(const base of ['', '/portfolio']){
  assert.equal(withBasePath('https://example.com/image.png',base),'https://example.com/image.png');
  assert.equal(withBasePath('#section',base),'#section');
 }
 assert.equal(withBasePath('/uploads/test.png','/portfolio/'),'/portfolio/uploads/test.png');
 assert.equal(withBasePath('/portfolio/uploads/test.png','/portfolio'),'/portfolio/uploads/test.png');
 assert.equal(normalizeBasePath('/'),'');assert.throws(()=>normalizeBasePath('/../private'));
});

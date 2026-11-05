import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newStory, serialize, parseStory, storyPath, encode, decode } from '../src/scripts/writer/model.ts';
import { GitHub } from '../src/scripts/writer/github.ts';

test('story metadata safely round-trips punctuation, Unicode, and multiline summaries', () => {
  const story={...newStory(),title:'A title: "quoted" — पूजा',description:'First line\n---\nsecond line',tags:'Android, API',metadata:{severity:'high',cve:'CVE-test'}};
  const file=serialize(story,'## Heading\n\n**Bold** and `code`.');
  const parsed=parseStory(file);
  assert.equal(parsed.metadata.title,story.title);assert.equal(parsed.metadata.description,story.description);
  assert.equal(parsed.metadata.severity,'high');assert.equal(parsed.metadata.draft,false);
  assert.deepEqual(parsed.metadata.tags,['Android','API']);assert.match(parsed.markdown,/\*\*Bold\*\*/);
  assert.equal(decode(encode(file)),file);
});
test('validation refuses empty stories and paths outside the content collections',()=>{
  assert.throws(()=>serialize(newStory(),''));
  assert.throws(()=>storyPath({...newStory(),path:'portfolio-site/src/content/blog/../../package.json.md'}));
  assert.match(storyPath({...newStory(),title:'../../ Hello?'}),/^portfolio-site\/src\/content\/blog\/hello-[a-f0-9]+\.md$/);
});
test('publishing uses SHA conflict protection and never forces an overwrite',async()=>{
  const calls:any[]=[];
  const client=new GitHub('test-only-token',async(url,options)=>{calls.push({url,options});return new Response(JSON.stringify({content:{sha:'new-sha'},commit:{sha:'commit-sha'}}),{status:200});});
  const story={...newStory(),title:'Update',description:'Summary',path:'portfolio-site/src/content/blog/original.md',sha:'original-sha'};
  const result=await client.publish(story,'Actual story text');
  const body=JSON.parse(calls[0].options.body);assert.equal(body.sha,'original-sha');assert.equal(body.branch,'main');assert.equal(result.sha,'new-sha');assert.equal(body.force,undefined);
  const failed=new GitHub('test-only-token',async()=>new Response('{}',{status:409}));
  await assert.rejects(()=>failed.publish(story,'Actual story text'),/repository changed/);
  assert.equal(story.sha,'original-sha');
});
test('images reject SVG and oversized uploads before contacting GitHub',async()=>{
  let calls=0;const client=new GitHub('test-only-token',async()=>{calls++;return new Response('{}');});
  await assert.rejects(()=>client.image('data:image/svg+xml;base64,PHN2Zz4='));
  await assert.rejects(()=>client.image('data:image/png;base64,'+'A'.repeat(7_000_001)));
  assert.equal(calls,0);
});

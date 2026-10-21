import {test} from 'node:test';
import assert from 'node:assert/strict';
import {navigateWorkspace as go} from '../lib/workspace-navigation.mjs';
const initial=()=>({current:null,history:[]});
test('app switching and back retain the previous window',()=>{
 let s=go(initial(),{type:'open',panel:'apps'});
 s=go(s,{type:'open',panel:'about'});
 s=go(s,{type:'open',panel:'journey'});
 assert.deepEqual(s,{current:'journey',history:['apps','about']});
 s=go(s,{type:'back'});assert.equal(s.current,'about');
 s=go(s,{type:'back'});assert.equal(s.current,'apps');
 s=go(s,{type:'back'});assert.deepEqual(s,initial());
});
test('home and close clear navigation history; repeated app opens do not duplicate it',()=>{
 const open=go(initial(),{type:'open',panel:'research'});
 assert.deepEqual(go(open,{type:'open',panel:'research'}),open);
 for(const type of ['home','close'])assert.deepEqual(go(go(open,{type:'open',panel:'writing'}),{type}),initial());
 assert.deepEqual(go(initial(),{type:'back'}),initial());
});

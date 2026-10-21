import {test} from 'node:test';
import assert from 'node:assert/strict';
import {shouldShowPortfolio} from '../lib/access.mjs';
test('entrance remains emulator-only and portfolio sections require success',()=>{
  assert.equal(shouldShowPortfolio('/',false),false);
  assert.equal(shouldShowPortfolio('/',true),false);
  for(const route of ['/portfolio/','/research/','/projects/','/speaking/','/contact/']){
    assert.equal(shouldShowPortfolio(route,false),false,route);
    assert.equal(shouldShowPortfolio(route,true),true,route);
  }
});
test('writing stays directly accessible without opening other portfolio routes',()=>{
  for(const route of ['/blog','/blog/','/blog/android-root-detection/'])assert.equal(shouldShowPortfolio(route,false),true);
  assert.equal(shouldShowPortfolio('/blogging',false),false);
});

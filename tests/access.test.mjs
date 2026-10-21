import {test} from 'node:test';
import assert from 'node:assert/strict';
import {shouldShowPortfolio} from '../lib/access.mjs';
test('homepage stays the challenge while existing content routes remain accessible',()=>{assert.equal(shouldShowPortfolio('/'),false);for(const route of ['/portfolio/','/about/','/research/','/projects/','/speaking/','/contact/','/blog/','/blog/android-root-detection/'])assert.equal(shouldShowPortfolio(route),true,route)});

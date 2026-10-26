import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const path=new URL('../site/app.js',import.meta.url);
test('Public Mercata app body parses before Firefox loads the catalog',()=>{
 const source=fs.readFileSync(path,'utf8');
 const withoutImports=source.replace(/^import\s+.*;$/gm,'');
 assert.doesNotThrow(()=>new Function(withoutImports));
 assert(source.includes('The over-25% result refers to multi-language-audio watch time among selected creators.'));
});

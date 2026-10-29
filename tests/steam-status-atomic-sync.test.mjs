import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {FILES,metricsFromSteam,synchronizeSteamTexts} from '../scripts/sync-steam-status.mjs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const json=p=>JSON.parse(read(p));
const original=Object.fromEntries(FILES.map(p=>[p,read(p)]));
test('Current Steam published status matches source-derived progress everywhere',()=>{
 const m=metricsFromSteam(json('plans/steam.json'),json('queues/steam.json'),json('specimens/steam.json'));
 assert.equal(m.rounded,Math.round(m.exact));
 assert.equal(m.sources,json('specimens/steam.json').evidence.length);
 assert.deepEqual(synchronizeSteamTexts(original,m),original);
});
test('The status patch is idempotent and does not rewrite historical roadmap entries',()=>{
 const m=metricsFromSteam(json('plans/steam.json'),json('queues/steam.json'),json('specimens/steam.json'));
 const old={...original};
 old['README.md']=old['README.md'].replace('Steam research is underway at '+m.rounded+'%','Steam research is underway at 17%');
 old['gallery/README.md']=old['gallery/README.md'].replace('**Researching, '+m.rounded+'%**','**Researching, 17%**');
 old['roadmap/README.md']=old['roadmap/README.md'].replace('**'+m.rounded+'%** (exact **'+m.exact.toFixed(3)+'%**)','**17%** (exact **17.000%**)');
 const fixed=synchronizeSteamTexts(old,m);
 assert.deepEqual(fixed,original);
 assert.deepEqual(synchronizeSteamTexts(fixed,m),fixed);
 assert(fixed['roadmap/README.md'].includes('**Steam partner legal signatory and agreement boundary'));
});
test('Incomplete task inventories and missing anchors are rejected',()=>{
 const m=metricsFromSteam(json('plans/steam.json'),json('queues/steam.json'),json('specimens/steam.json'));
 assert.throws(()=>synchronizeSteamTexts({...original,'pipeline/README.md':'broken'},m),/Expected one/);
 const p=json('plans/steam.json');p.detail_tasks.pop();
 assert.throws(()=>metricsFromSteam(p,json('queues/steam.json'),json('specimens/steam.json')),/293/);
});

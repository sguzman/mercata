import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Platform release QA requirements do not imply a game was tested',()=>{
 const x=get('ontology/itch-io/cross-platform-release-qa-2026.json'),d=get('specimens/itch-io.json');
 assert.equal(x.platform_targets.length,5);
 assert(x.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
 assert(x.platform_targets.every(x=>x.measured_pass===null&&x.tests.length>0));
 assert.equal(x.actual_builds_tested,0);
 assert(Object.values(x.unmeasured).every(v=>v===null));
});

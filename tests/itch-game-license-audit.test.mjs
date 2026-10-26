import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {assessItchGameLicenseInventory} from '../site/itch-game-license-audit.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Commercial code and media permissions are different license grants',()=>{
 const x=get('ontology/itch-io/game-code-art-commercial-licenses-2026.json'),d=get('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(y=>y.id===id)));
 assert.equal(x.licenses.find(x=>x.id==='MIT').commercial_distribution_permitted_under_license,true);
 assert.equal(x.licenses.find(x=>x.id==='GPL-3.0').copyleft_source_delivery,true);
 assert.equal(x.licenses.find(x=>x.id==='CC-BY-NC-4.0').commercial_distribution_permitted_under_license,false);
 assert.equal(x.platform_separation.game_engine_code_license_implies_art_license,false);
});
test('Noncommercial media blocks an ordinary paid game without separately documented rights',()=>{
 const r=assessItchGameLicenseInventory([{id:'illustration',kind:'media',license:'CC-BY-NC-4.0',required_notices_verified:true}]);
 assert.equal(r.blocked_components.length,1);assert.equal(r.certified_legal_compliance,false);
 const alt=assessItchGameLicenseInventory([{id:'illustration',kind:'media',license:'CC-BY-NC-4.0',alternative_commercial_permission_verified:true,required_notices_verified:true}]);
 assert.equal(alt.blocked_components.length,0);assert(alt.review_issues.length>0);
});
test('MIT plus attributed licensed media has a plausible path, not full game legal approval',()=>{
 const r=assessItchGameLicenseInventory([{id:'source',kind:'code',license:'MIT',required_notices_verified:true},{id:'art',kind:'media',license:'CC-BY-4.0',required_notices_verified:true}]);
 assert.equal(r.plausible_standard_permission_path,true);
 assert.equal(r.certified_legal_compliance,false);assert.equal(r.paid_order_count,null);assert.equal(r.creator_profit_usd,null);
});
test('GPL binaries need source and compatibility review; missing notices block plausible readiness',()=>{
 const g=assessItchGameLicenseInventory([{id:'engine',kind:'code',license:'GPL-3.0',required_notices_verified:true,corresponding_source_delivery_verified:true}]);
 assert(g.review_issues.some(x=>x.includes('compatibility')||x.includes('combination')));
 const a=assessItchGameLicenseInventory([{id:'lib',kind:'code',license:'Apache-2.0',required_notices_verified:false}]);
 assert.equal(a.plausible_standard_permission_path,false);
 assert.throws(()=>assessItchGameLicenseInventory([{id:'duplicate',kind:'code',license:'MIT'},{id:'duplicate',kind:'code',license:'MIT'}]));
});
test('Open-source commercialization research task is evidence-backed but not sales',()=>{
 const p=get('plans/itch-io.json');
 const t=p.detail_tasks.find(x=>x.id==='itch-io/rights/map-open-source-commercialization');
 assert.equal(t.status,'complete');assert.equal(t.percent,100);
 assert(t.evidence.includes('tests/itch-game-license-audit.test.mjs'));
});

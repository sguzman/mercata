import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Multiplayer obligations never substitute guesswork for invoices or availability tests',()=>{
 const a=read('ontology/itch-io/multiplayer-operational-cost-categories-2026.json'),s=read('specimens/itch-io.json'),p=read('plans/itch-io.json');
 const sources=new Set(s.evidence.map(x=>x.id));
 assert(a.source_ids.every(id=>sources.has(id)));
 for(const id of ['network_bandwidth','availability_and_incident_response','moderation_and_abuse','maintenance_and_security']){
  const c=a.operational_cost_register.find(x=>x.id===id);assert(c);assert.equal(c.monthly_cash_usd,null);assert(c.qa_gate.length>15);
 }
 assert.equal(a.release_modes.find(x=>x.mode==='offline_single_player').incremental_dedicated_multiplayer_hosting_cost_usd,0);
 assert.equal(a.release_modes.find(x=>x.mode==='online_external_backend').incremental_dedicated_multiplayer_hosting_cost_usd,null);
 assert(Object.values(a.observed).every(x=>x===null||x===false));
 const t=p.detail_tasks.find(x=>x.id==='itch-io/special-games/assess-multiplayer-hosting');
 assert.equal(t.percent,100);assert.equal(t.status,'complete');
 for(const f of ['ontology/itch-io/multiplayer-operational-cost-categories-2026.json','ontology/itch-io/multiplayer-operational-cost-categories-2026.md','tests/itch-multiplayer-operating-costs.test.mjs'])assert(t.evidence.includes(f));
 assert.equal(p.total_tracked_tasks,244);
});

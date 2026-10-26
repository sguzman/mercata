import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Zero cash means no upfront spend, not zero labor or proof of sales',()=>{
 const s=load('ontology/itch-io/first-game-entry-scenario-2026.json');
 const d=load('specimens/itch-io.json');
 assert(s.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.equal(s.hypothetical_pilot.platform_listing_fee_usd,0);
 assert.equal(s.hypothetical_pilot.new_game_development_cash_spend_usd,0);
 assert.equal(s.hypothetical_pilot.creator_labor_hours,null);
 assert.equal(s.hypothetical_pilot.actual_sales,null);
 assert.equal(s.hypothetical_pilot.early_stop_conditions.owner_approved,false);
 assert.equal(s.roles.find(x=>x.id==='account_owner').individual_earnings_inferred,false);
 assert.equal(s.roles.find(x=>x.id==='contributor').automatically_revenue_split,false);
 assert.equal(s.roles.find(x=>x.id==='cooperative_bundle_participant').automatically_personal_salary,false);
 assert(Object.values(s.unobserved).every(x=>x===null));
});

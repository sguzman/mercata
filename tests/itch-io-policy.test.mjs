import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('itch.io historic payment disruptions are not mislabeled current universal bans',()=>{
 const x=read('ontology/itch-io/policy-risk-2025-2026.json'),d=read('specimens/itch-io.json');
 assert.deepEqual(x.events.map(e=>e.date),['2025-07-24','2025-07-31']);
 assert(x.events.every(e=>e.source_ids.every(id=>d.evidence.some(s=>s.id===id))));
 assert(x.events.every(e=>e.measured_number_of_affected_sellers===null&&e.measured_lost_revenue===null));
 assert(x.events.every(e=>e.applies_to_every_game===false));
 assert.equal(x.current_commercial_adult_reindex_status,null);
 assert.equal(x.current_all_genres_payment_support,null);
 assert.equal(x.percent_market_affected,null);
 assert.equal(x.creator_income_effect,null);
 assert.equal(x.typical_payout_loss,null);
 assert(x.governance_layers.every(l=>l.source_ids.every(id=>d.evidence.some(s=>s.id===id))));
});

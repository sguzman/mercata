import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));const file="ontology/itch-io/global-operations-drop-zone-2026-operating-cost-shutdown.json";
test('Reported offline 2D browser multiplayer is a live-service cost case, not itch paid game',()=>{
 const x=get(file),d=get('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
 assert.equal(x.same_game_count,1);
 assert.equal(x.outcome.last_server_offline,'2026-03-13');
 assert.equal(x.outcome.monetization_inadequate_for_operating_costs_reported,true);
 assert.equal(x.outcome.payment_provider_external_stripe,true);
 assert.equal(x.outcome.itch_checkout_paid_orders_verified,false);
 assert.equal(x.outcome.claimed_zero_revenue,false);
 assert.equal(x.outcome.concurrent_players_near_zero_reported,true);
});
test('No synthetic amounts, zero sale inference or current uptime assertion',()=>{
 const x=get(file);
 assert(Object.values(x.unknown).every(v=>v===null));
 assert(x.limits.some(s=>s.includes('snapshot')));
});
test('Technical operating dependency study advances only its existing task',()=>{
 const p=get('plans/itch-io.json'),q=get('queues/itch-io.json');
 const t=p.detail_tasks.find(t=>t.id==='itch-io/risk/measure-engine-and-dependency-maintenance');
 assert(t.percent>=89&&t.percent<100&&t.status==='in_progress');
 for(const f of [file,"ontology/itch-io/global-operations-drop-zone-2026-operating-cost-shutdown.md","tests/itch-2d-multiplayer-server-shutdown-cost.test.mjs"])assert(t.evidence.includes(f));
 assert.equal(p.detail_tasks.length,160);assert.equal(q.queues.flatMap(w=>w.tasks).length,84);
});

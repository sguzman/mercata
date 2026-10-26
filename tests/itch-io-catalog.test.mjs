import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('itch.io public catalog counts have explicit, separate game filter frames',()=>{
 const x=read('ontology/itch-io/catalog-snapshot-2026.json'),d=read('specimens/itch-io.json');
 assert.equal(x.kind,'public_catalog_browse_snapshot');
 assert.equal(x.retrieved_at,'2026-10-26');
 assert.deepEqual(x.observations.slice(0,3).map(x=>x.value),[1780861,49588,428856]);
 assert.equal(x.observations.find(x=>x.id==='games_paid_2d')?.value,12691);
 assert.deepEqual(x.observations.slice(0,3).map(x=>x.filter),['all_games','paid_games','tag_2d_all_prices']);
 assert.equal(new Set(x.observations.map(x=>x.id)).size,x.observations.length);
 assert(x.observations.every(x=>x.money_earned===null&&x.unique_creators===null&&x.paid_sales===null));
 assert(x.observations.every(x=>d.evidence.some(s=>s.id===x.source_id)));
 assert(x.derived.paid_filter_to_all_results_ratio>0.02&&x.derived.paid_filter_to_all_results_ratio<0.03);
 assert.equal(x.derived.not_a_buyer_or_creator_share,true);
 assert(Object.values(x.unsupported).every(v=>v===null));
});
test('No market revenue or developer earning samples inferred from paid listings',()=>{
 const d=read('specimens/itch-io.json'),p=read('plans/itch-io.json');
 const slice=d.claims.filter(c=>c.id.startsWith('catalog-'));
 assert(slice.length>=3);
 assert(['catalog-total','catalog-paid','catalog-2d','catalog-paid-2d'].every(id=>slice.some(c=>c.id===id)));
 assert.equal(new Set(slice.map(c=>c.id)).size,slice.length);
 assert(slice.every(c=>c.source_ids.every(id=>d.evidence.some(s=>s.id===id))));
 assert(!d.observations.some(x=>/profit|revenue|purchase|earnings/.test(x.metric)));
 assert.equal(p.total_tracked_tasks,244);
 assert(p.progress_percent>21);
});

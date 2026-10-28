import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=get('ontology/steam/multiplayer-network-and-steampipe-operations-2026.json'),d=get('specimens/steam.json'),plan=get('plans/steam.json'),q=get('queues/steam.json');
test('Lobbies are not game transport and unknown host economics stay unknown',()=>{
 assert.equal(x.multiplayer.lobbies.transports_gameplay,false);
 assert.equal(x.multiplayer.lobbies.max_members,250);
 assert.equal(x.multiplayer.real_monthly_server_cost_usd,null);
 assert.equal(x.unknown.actual_multiplayer_roi,null);
});
test('Changed bytes do not predict real SteamPipe transfer or temp disk',()=>{
 assert.equal(x.steampipe.initial_chunk_size_approx_bytes,1048576);
 assert.equal(x.steampipe.whole_pack_rebuild_can_require_second_local_copy,true);
 assert.equal(x.illustrative_not_real.actual_patch_download_gib,null);
 assert.equal(x.steampipe.real_download_bytes,null);
});
test('Sources and claims are grounded and fixed Steam task count preserved',()=>{
 const src=new Set(d.evidence.map(z=>z.id)),claims=new Map(d.claims.map(z=>[z.id,z]));
 assert.equal(x.source_ids.length,6);assert.equal(x.claim_ids.length,18);
 for(const id of x.source_ids)assert(src.has(id),id);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(k=>src.has(k)));}
 const values=[...plan.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(values.length,293);assert.equal(Math.round(values.reduce((a,b)=>a+b,0)/293),plan.progress_percent);
});

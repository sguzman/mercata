import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/steam-versus-epic-pc-distribution-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Epic per-title calendar-year tier is distinct from publisher-wide earnings and Steam contracts',()=>{
 assert.equal(x.scope.new_specimen_admitted,false);
 assert.equal(x.epic.standard_share.first_tier_limit_usd_net_revenue_per_title_per_calendar_year,1000000);
 assert.equal(x.epic.standard_share.developer_share_first_tier,1);
 assert.equal(x.epic.standard_share.developer_share_above,0.88);
 assert.equal(x.epic.standard_share.annual_reset_from_2026,'January 1');
 assert.equal(x.epic.standard_share.title_transfer_resets,false);
 assert.equal(x.steam.universal_individual_partner_share_verified,false);
 assert.equal(x.unknown.epic_game_median_net_payout,null);
});
test('Optional exclusivity and online multiplayer requirements are not ignored',()=>{
 assert.equal(x.epic.optional_first_run.initial_exclusivity_months,6);
 assert.equal(x.epic.optional_first_run.simultaneous_standard_steam_pc_launch_compatible,false);
 assert.equal(x.epic.optional_first_run.early_exit_retroactive_share_possible,true);
 assert.equal(x.epic.cross_store.online_multiplayer_pc_crossplay_required,true);
 assert.equal(x.epic.cross_store.prelaunch_test_build_lead_weeks,4);
 assert.equal(x.unknown.actual_multiplayer_porting_cost,null);
});
test('Every source and claim is attributable, Steam tasks remain fixed',()=>{
 const s=new Set(d.evidence.map(z=>z.id)),c=new Map(d.claims.map(z=>[z.id,z]));
 assert.equal(x.source_ids.length,7);assert.equal(x.claim_ids.length,16);
 for(const id of x.source_ids)assert(s.has(id),id);
 for(const id of x.claim_ids){assert(c.has(id),id);assert(c.get(id).source_ids.every(id=>s.has(id)));}
 const values=[...p.detail_tasks.map(z=>z.percent),...q.queues.flatMap(g=>g.tasks.map(z=>z.progress))];
 assert.equal(values.length,293);assert.equal(p.progress_percent,Math.round(values.reduce((a,b)=>a+b,0)/293));
 assert(Object.values(x.unknown).every(v=>v===null));
});

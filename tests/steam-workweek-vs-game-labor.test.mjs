import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/professional-hours-versus-shipping-labor-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('GDC full-industry workweeks and Unity Editor project-hours are not Steam per-game labor',()=>{
 assert.equal(x.gdc2026.non_solo_share_avg_workweek_40plus,0.59);
 assert.equal(x.gdc2026.solo_share_max_week_60plus,0.37);
 assert.equal(x.gdc2026.year_on_year_comparison_valid,false);
 assert.equal(x.gdc2026.total_hours_per_published_game,null);
 assert.equal(x.unity2026.editor_hours_equal_full_production_time,false);
 assert.equal(x.unity2026.paid_steam_game_hours,null);
});
test('GDC and Unity populations and survey/telemetry bases are explicitly separate',()=>{
 assert(x.gdc2026.respondents_more_than>=2300);
 assert.equal(x.gdc2026.steam_publishers_only,false);
 assert.equal(x.unity2026.survey_respondents,300);
 assert.equal(x.unity2026.survey_and_telemetry_same_population,false);
 assert.equal(x.unity2026.survey_prototype_3_months_or_less_share,0.67);
 assert(Object.values(x.unknown).every(v=>v===null));
});
test('Source and claims are attributable with 293 unchanged tasks',()=>{
 const s=new Set(d.evidence.map(e=>e.id)),c=new Map(d.claims.map(e=>[e.id,e]));
 assert.equal(x.source_ids.length,2);assert.equal(x.claim_ids.length,10);
 for(const id of x.source_ids)assert(s.has(id),id);
 for(const id of x.claim_ids){assert(c.has(id),id);assert(c.get(id).source_ids.every(sid=>s.has(sid)));}
 const values=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(values.length,293);assert.equal(p.progress_percent,Math.round(values.reduce((s,n)=>s+n,0)/293));
});

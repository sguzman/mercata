import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {comparableCohorts,summarizeSelectedBreakouts} from '../site/steam-cohort-comparability.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=get('ontology/steam/debut-studios-publisher-selection-and-breakouts-2026.json'),d=get('specimens/steam.json'),p=get('plans/steam.json'),q=get('queues/steam.json');
test('Store-name first-release statistics are not publisher income or legal entity counts',()=>{
 assert.equal(x.studio_history.approx_share_one_observed_game_pct,77);
 assert.equal(x.studio_history.right_censoring_adjusted,false);
 assert.equal(x.studio_history.verified_legal_publisher,false);
 assert.equal(x.unknown.median_developer_profit,null);
});
test('Platform and success-selected cohorts are blocked from being pooled',()=>{
 const common={platforms:['Steam'],unit:'appid',eligibility:'all_initial_paid',horizon_days:30,measure:'gross',model:'A',time_zero:'first_sale',missingness:'explicit'};
 assert(comparableCohorts(common,{...common}).comparable);
 const mixed={...common,platforms:['Steam','Xbox'],eligibility:'over_500k_first_month',horizon_days:365};
 const z=comparableCohorts(common,mixed);
 assert(!z.comparable);assert(z.differences.includes('platforms'));assert(z.differences.includes('eligibility'));
});
test('Breakouts do not give all Steam game success probability',()=>{
 const v=summarizeSelectedBreakouts({total:55,indie:13},{total:76,indie:33});
 assert.equal(v.change_in_selected_games,21);assert.equal(v.change_in_indie_selected_games,20);
 assert.equal(v.probability_any_steam_launch_breaks_out,null);
 assert.equal(x.breakouts.all_paid_steam_releases_denominator,null);
});
test('Source and task references remain intact',()=>{
 const ids=new Set(d.evidence.map(s=>s.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,5);assert.equal(x.claim_ids.length,15);
 for(const s of x.source_ids)assert(ids.has(s),s);
 for(const id of x.claim_ids){const c=claims.get(id);assert(c,id);assert(c.source_ids.every(s=>ids.has(s)));}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(Math.round(scores.reduce((a,b)=>a+b,0)/293),p.progress_percent);
});

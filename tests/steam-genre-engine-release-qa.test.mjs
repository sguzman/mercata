import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {assessSteamReleaseReadiness,STEAM_ENGINE_GATES} from '../site/steam-engine-release-gates.mjs';
const read=path=>JSON.parse(fs.readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const evidence=read('ontology/steam/genre-engine-integration-and-steampipe-qa-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('No missing release validation gate is treated as a passing build',()=>{
 const x=assessSteamReleaseReadiness({pc_export:'pass'});
 assert.equal(x.ready_for_release,false);
 assert.equal(x.unverified.length,STEAM_ENGINE_GATES.length-1);
 assert.equal(x.verified_developer_profit,null);
});
test('Only all-pass synthetic gates count as paper ready, with no ROI inferred',()=>{
 const x=assessSteamReleaseReadiness(Object.fromEntries(STEAM_ENGINE_GATES.map(x=>[x,'pass'])));
 assert.equal(x.ready_for_release,true);
 assert.equal(x.commercial_success_probability,null);
 assert.equal(x.verified_developer_profit,null);
 assert.throws(()=>assessSteamReleaseReadiness({pc_export:'unknown'}),/Unknown gate status/);
});
test('Engine capabilities and launch distribution are recorded separately',()=>{
 assert.equal(evidence.engine_paths.renpy.market_distribution,true);
 assert.equal(evidence.engine_paths.godot.resource_only_pck_is_game_executable,false);
 assert.equal(evidence.engine_paths.godot.mix_extension_and_module,false);
 assert.equal(evidence.steam_distribution.steampipe_separate_from_engine_export,true);
 assert.equal(evidence.unknown.real_engineering_hours,null);
 assert.equal(evidence.unknown.developer_profit,null);
});
test('All bounded claims are attributable and fixed Steam scope is unchanged',()=>{
 const ss=new Set(d.evidence.map(x=>x.id)),cc=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(evidence.source_ids.length,5);
 assert.equal(evidence.claim_ids.length,20);
 for(const x of evidence.source_ids)assert(ss.has(x),x);
 for(const x of evidence.claim_ids){assert(cc.has(x),x);assert(cc.get(x).source_ids.every(s=>ss.has(s)));}
 const scores=[...p.detail_tasks.map(x=>x.percent),...q.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});

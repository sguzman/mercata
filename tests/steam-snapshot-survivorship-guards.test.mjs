import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {reconcileSyntheticSteamSnapshots as audit} from '../site/steam-snapshot-survivorship-guards.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const doc=load('ontology/steam/steam-historical-snapshot-survivorship-2026.json'),d=load('specimens/steam.json'),p=load('plans/steam.json'),q=load('queues/steam.json');
const window={start:'2025-01-01',endExclusive:'2026-01-01'};
const catalog=(id,date,records,complete_pagination=true)=>({snapshot_id:id,captured_at:date,kind:'current_store_list',frame_id:'fixture-game-worldwide',complete_pagination,records:records.map(fixture_id=>({fixture_id,last_modified:date}))});
const attested=(fixture_id,date='2025-04-01',status=true,mode='early_access',app_type='game')=>({snapshot_id:'fixture-attest-'+fixture_id,captured_at:'2026-01-02',kind:'first_release_attestation',records:[{fixture_id,app_type,initial_paid_status:status,first_paid_playable_date:date,release_mode:mode}]});
test('Historical paid-release evidence survives disappearance from a later complete catalog',()=>{
 const a=audit([catalog('fixture-old','2025-06-01',['fixture-a','fixture-b']),catalog('fixture-new','2026-10-29',['fixture-b']),attested('fixture-a')],window);
 assert.deepEqual(a.counts,{eligible:1,excluded:0,unresolved:1});
 assert.equal(a.previously_listed_absent_from_latest_complete_catalog,1);
 assert.equal(a.entries.find(x=>x.fixture_id==='fixture-a').absent_from_latest_complete_catalog,true);
 assert.equal(a.entries.find(x=>x.fixture_id==='fixture-a').confirmed_retired,null);
 assert.equal(a.total_market_eligible_paid_games,null);
 assert.equal(a.market_zero_paid_order_fraction,null);
});
test('Last modified timestamp and current catalog presence do not establish release date or paid status',()=>{
 const a=audit([catalog('fixture-now','2026-10-29',['fixture-a'])],window);
 assert.deepEqual(a.counts,{eligible:0,excluded:0,unresolved:1});
 assert.equal(a.entries[0].reason,'no_verified_initial_offer_evidence');
});
test('Conflicting first-release attestations are unresolved; identical ones deduplicate',()=>{
 const a=attested('fixture-a'),b=attested('fixture-a');
 b.snapshot_id='fixture-second';b.records[0].first_paid_playable_date='2025-05-01';
 assert.equal(audit([a,b],window).entries[0].reason,'conflicting_initial_offer_attestations');
 b.records[0].first_paid_playable_date='2025-04-01';
 assert.equal(audit([a,b],window).counts.eligible,1);
});
test('Free origins, non-games, future releases and unknown statuses never become paid games',()=>{
 const r=[attested('fixture-free','2025-04-01',false),attested('fixture-demo','2025-04-01',true,'full_release','demo'),attested('fixture-future','2026-01-01'),attested('fixture-unknown',null,null,null)];
 const a=audit(r,window);
 assert.deepEqual(a.counts,{eligible:0,excluded:3,unresolved:1});
 assert.equal(a.captured_candidate_count,4);
});
test('Partial pagination cannot prove disappearance and mismatched catalog scopes are rejected',()=>{
 const a=audit([catalog('fixture-old','2025-06-01',['fixture-a']),catalog('fixture-new','2026-01-01',[],false)],window);
 assert.equal(a.previously_listed_absent_from_latest_complete_catalog,null);
 assert.equal(a.entries[0].absent_from_latest_complete_catalog,false);
 const bad=catalog('fixture-other','2026-01-02',['fixture-b']);bad.frame_id='fixture-different-country';
 assert.throws(()=>audit([catalog('fixture-old','2025-06-01',['fixture-a']),bad],window),/Incompatible/);
});
test('Reject duplicate ID, malformed dates, real-looking IDs and improperly claimed current paid status',()=>{
 const a=catalog('fixture-list','2025-06-01',['fixture-a']);
 assert.throws(()=>audit([a,a],window),/Unique synthetic snapshot/);
 assert.throws(()=>audit([catalog('fixture-list','2025-06-01',['fixture-a','fixture-a'])],window),/Unique synthetic game/);
 assert.throws(()=>audit([catalog('fixture-list','2025-06-01',['489'])],window),/Unique synthetic game/);
 assert.throws(()=>audit([{...a,records:[{fixture_id:'fixture-a',initial_paid_status:true}]}],window),/cannot independently attest/);
 assert.throws(()=>audit([attested('fixture-future','2026-10-30')],window),/postdate evidence capture/);
});
test('Audited studies link public sources and remain a 293-task economic research project',()=>{
 assert.equal(doc.claim_ids.length,8);assert.equal(doc.source_ids.length,5);
 const sources=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 for(const id of doc.source_ids)assert(sources.has(id),id);
 for(const id of doc.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>sources.has(s)),id)}
 const all=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(all.length,293);assert.equal(p.progress_percent,Math.round(all.reduce((x,y)=>x+y,0)/293));
 for(const k of ['observed_eligible_paid_game_count','observed_omitted_paid_game_count','market_zero_sale_fraction'])assert.equal(doc.unknown[k],null);
 assert.equal(audit(doc.synthetic_snapshots,window).counts.eligible,2);
});

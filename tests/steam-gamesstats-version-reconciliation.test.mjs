import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticVendorMeanTotal as audit} from '../site/steam-vendor-mean-total-consistency-guard.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const s=read('ontology/steam/gamesstats-q1-2026-conflicting-version-denominators-mean-total-audit.json'),
 d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test("Same vendor versions have different sample dates and denominators rather than independent replications",()=>{
 assert.equal(s.report_versions[0].reported_game_count,7478);
 assert.equal(s.report_versions[1].reported_game_count,6169);
 assert.equal(s.report_versions[1].paid_game_count+s.report_versions[1].free_game_count,6169);
 assert(s.report_versions[1].cohort_end>s.report_versions[0].cohort_end);
 assert.equal(s.cross_version.same_vendor,true);
 assert.equal(s.cross_version.can_treat_versions_as_independent_replications,false);
 assert.equal(s.cross_version.site_direct_document_fetch_success,false);
 assert.equal(s.descriptive_arithmetic.both_reports_include_april,true);
});
test('7,478 reported mean of 110k and 650m total are not arithmetically aligned',()=>{
 const z=audit({fixture_id:'fixture-patreon',reported_game_count:7478,reported_mean_usd:110000,reported_total_usd:650000000});
 assert.equal(z.reconstructed_total_usd,822580000);
 assert.equal(z.total_minus_reconstructed_usd,-172580000);
 assert.equal(z.gap_larger_than_fifteen_percent,true);
 assert.equal(z.original_data_error_proven,false);
 assert(Math.abs(z.implied_mean_usd-650000000/7478)<1e-9);
});
test('A distinct 6169/120k/733m version nearly reconciles with rounding, not real sales verification',()=>{
 const z=audit({fixture_id:'fixture-site',reported_game_count:6169,reported_mean_usd:120000,reported_total_usd:733000000});
 assert.equal(z.reconstructed_total_usd,740280000);
 assert.equal(z.total_minus_reconstructed_usd,-7280000);
 assert.equal(z.gap_larger_than_fifteen_percent,false);
 for(const k of ['actual_merchants_paid_orders','verified_gross_income_distribution','legal_publisher_bank_median','zero_paid_sale_fraction'])assert.equal(z[k],null);
 assert(Object.values(s.unknown).every(x=>x===null));
});
test('Reject untrusted real-app or invalid negative/non-numeric synthetic inputs',()=>{
 const x={fixture_id:'fixture-mean',reported_game_count:10,reported_mean_usd:120,reported_total_usd:1200};
 for(const v of [{real_appid:123},{account_id:'private'},{fixture_id:'real data'},{reported_game_count:2.3},{reported_mean_usd:-1},{reported_total_usd:Infinity},{reported_total_usd:-2}])assert.throws(()=>audit({...x,...v}));
 assert.throws(()=>audit([10,120,1200]));
});
test('Public citations preserve original 293 task inventory and progress arithmetic',()=>{
 const sourceIds=new Set(d.evidence.map(x=>x.id)),claimIds=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(s.source_ids.length,2);assert.equal(s.claim_ids.length,12);
 for(const id of s.source_ids)assert(sourceIds.has(id));
 for(const id of s.claim_ids){assert(claimIds.has(id));assert(claimIds.get(id).source_ids.every(x=>sourceIds.has(x)));}
 const scores=[...p.detail_tasks.map(x=>x.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});

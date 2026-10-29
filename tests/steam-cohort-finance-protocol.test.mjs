import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {classifyPaidRelease,summarizePaidReleaseCandidates} from '../site/steam-cohort-frame.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const cohort=get('ontology/steam/fixed-paid-release-cohort-2026.json'), finance=get('ontology/steam/financial-validation-and-consent-2026.json'), specimen=get('specimens/steam.json'),plan=get('plans/steam.json'),queue=get('queues/steam.json');
const window={start:'2025-01-01',endExclusive:'2026-01-01'};
test('zero-review games and retired titles remain eligible when historical paid launch verified',()=>{
 const a={appid:10,app_type:'game',paid_on_first_public_release:true,first_public_paid_release_date:'2025-05-02',reviews:0,available_in_store:false,retired:true};
 assert.deepEqual(classifyPaidRelease(a,window),{status:'eligible',reason:'first_public_paid_release_in_window'});
 const result=summarizePaidReleaseCandidates([a],window);
 assert.equal(result.counts.eligible,1);
 assert.equal(result.exact_zero_sale_games,null);
 assert.equal(result.paid_orders,null);
 assert.equal(result.total_eligible_original_paid_steam_games,null);
});
test('full launch is not a second paid launch if Early Access was already commercial',()=>{
 const a={appid:11,app_type:'game',paid_on_first_public_release:true,first_public_paid_release_date:'2024-10-31',full_1_0_date:'2025-05-02'};
 assert.deepEqual(classifyPaidRelease(a,window),{status:'excluded',reason:'outside_cohort_window'});
});
test('free launches and non-games are excluded; unknown launch terms are not labeled failures',()=>{
 const records=[
 {appid:12,app_type:'game',paid_on_first_public_release:false,first_public_paid_release_date:'2025-02-01'},
 {appid:13,app_type:'demo',paid_on_first_public_release:true,first_public_paid_release_date:'2025-02-01'},
 {appid:14,app_type:'game',paid_on_first_public_release:null,first_public_paid_release_date:'2025-02-01'},
 {appid:15,app_type:'game',paid_on_first_public_release:true,first_public_paid_release_date:null},
 {appid:16,app_type:'game',paid_on_first_public_release:true,first_public_paid_release_date:'2025-02-30'}
 ];
 const result=summarizePaidReleaseCandidates(records,window);
 assert.deepEqual(result.counts,{eligible:0,excluded:2,unresolved:3});
 assert.equal(result.publisher_count,null);
});
test('duplicate IDs, impossible dates and invalid cohort windows are never silently counted',()=>{
 const a={appid:17,app_type:'game',paid_on_first_public_release:true,first_public_paid_release_date:'2025-04-01'};
 assert.throws(()=>summarizePaidReleaseCandidates([a,a],window),/Duplicate AppID/);
 assert.throws(()=>classifyPaidRelease(a,{start:'2026-01-01',endExclusive:'2025-01-01'}),/Window/);
 assert.throws(()=>classifyPaidRelease({appid:-5},window),/AppID/);
});
test('preorder checkout alone is not a publicly playable paid game release',()=>{
 const a={appid:31,app_type:'game',paid_on_first_public_release:true,initial_paid_release_mode:'preorder_only',first_store_paid_order_date:'2024-12-20',first_public_paid_release_date:null};
 assert.deepEqual(classifyPaidRelease(a,window),{status:'unresolved',reason:'preorder_is_not_playable_release'});
 assert.equal(summarizePaidReleaseCandidates([a],window).counts.unresolved,1);
});
test('Advance Access is distinct from version 1.0 and earlier paid Early Access',()=>{
 const advance={appid:32,app_type:'game',paid_on_first_public_release:true,initial_paid_release_mode:'advance_access',first_store_paid_order_date:'2024-12-20',first_public_paid_release_date:'2025-01-03',full_1_0_date:'2025-01-06'};
 assert.equal(classifyPaidRelease(advance,window).status,'eligible');
 const early={appid:33,app_type:'game',paid_on_first_public_release:true,initial_paid_release_mode:'early_access',first_public_paid_release_date:'2024-12-20',full_1_0_date:'2025-01-06'};
 assert.equal(classifyPaidRelease(early,window).reason,'outside_cohort_window');
});
test('bad event labels, impossible order dates and reversed full release are unresolved',()=>{
 const a={appid:34,app_type:'game',paid_on_first_public_release:true,first_public_paid_release_date:'2025-04-01'};
 assert.equal(classifyPaidRelease({...a,initial_paid_release_mode:'beta_only'},window).reason,'initial_paid_release_mode_unknown');
 assert.equal(classifyPaidRelease({...a,first_store_paid_order_date:'2025-02-30'},window).reason,'first_store_paid_order_date_invalid');
 assert.equal(classifyPaidRelease({...a,full_1_0_date:'2025-03-01'},window).reason,'full_release_date_invalid_or_precedes_initial_paid_release');
 assert.equal(classifyPaidRelease({...a,first_store_paid_order_date:'2025-05-01'},window).status,'eligible');
});
test('dated claim links and unknown merchant outcomes stay intact',()=>{
 assert.equal(cohort.launch_event_audit_20261029.preorder_only_is_playable_paid_release,false);
 assert.equal(cohort.launch_event_audit_20261029.beta_test_playtime_exception,true);
 assert.equal(cohort.launch_event_audit_20261029.real_refund_outcomes,null);
 const ids=new Set(specimen.evidence.map(s=>s.id)),claims=new Map(specimen.claims.map(x=>[x.id,x]));
 for(const id of cohort.source_ids)assert(ids.has(id),id);
 for(const id of cohort.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(x=>ids.has(x)),id);}
});
test('official financial API structure keeps Steam checkout, retail keys and micros separate',()=>{
 assert.equal(finance.financial_line_types.steam_package.package_sale_type,'Steam');
 assert.equal(finance.financial_line_types.retail_key.package_sale_type,'Retail');
 assert.equal(finance.financial_line_types.microtransaction.line_item_type,'MicroTxn');
 assert.equal(finance.not_done.private_key_access,false);
 assert.equal(finance.not_done.private_data_export,false);
 assert.equal(finance.unknown.exact_zero_sales_share,null);
 assert(finance.no_unqualified_crosswalks.includes('primary_appid_to_entire_package_sale'));
});
test('cohort/finance claims and sources are grounded, and progress retains 293 tasks',()=>{
 assert.equal(cohort.claim_ids.length,21);
 assert.equal(finance.claim_ids.length,15);
 const sourceIds=new Set(specimen.evidence.map(s=>s.id)),claimIds=new Set(specimen.claims.map(c=>c.id));
 for(const s of cohort.source_ids.concat(finance.source_ids))assert(sourceIds.has(s),s);
 for(const c of cohort.claim_ids.concat(finance.claim_ids))assert(claimIds.has(c),c);
 assert.equal(sourceIds.size,specimen.evidence.length);
 assert.equal(claimIds.size,specimen.claims.length);
 assert(specimen.claims.every(c=>c.source_ids.every(s=>sourceIds.has(s))));
 assert.equal(cohort.observation_sensitivity.zero_sales_share,null);
 const all=[...plan.detail_tasks.map(t=>({p:t.percent,e:t.evidence})),...queue.queues.flatMap(g=>g.tasks.map(t=>({p:t.progress,e:t.evidence})))];
 assert.equal(all.length,293);
 assert.equal(Math.round(all.reduce((sum,t)=>sum+t.p,0)/293),plan.progress_percent);
 for(const t of all){if(t.p>0)assert(t.e.length>0);}
});

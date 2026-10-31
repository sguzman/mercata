import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditSteamPublicSurveyComposition as audit} from '../site/steam-hardware-survey-segmentation-guard.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const doc=read('ontology/steam/september-2026-voluntary-hardware-language-survey-buyer-boundaries.json'),d=read('specimens/steam.json');
const p=read('plans/steam.json'),q=read('queues/steam.json');
const good=()=>({
 survey_month:'2026-09',observed_on:'2026-10-30',mode:'optional_anonymous',
 platform_view:'combined',
 os_platform_share_basis_points:{windows:9503,linux:305,osx:192},
 selected_language_share_basis_points:{
  english:3420,simplified_chinese:3139,russian:905,japanese:241,spanish_latin_america:75}
});
test('September 2026 official combined-platform totals reconcile exactly',()=>{
 const x=audit(good());
 assert.equal(x.survey_month,'2026-09');
 assert.equal(x.os_platform_share_basis_points.windows,9503);
 assert.equal(x.os_platform_share_basis_points.linux,305);
 assert.equal(x.os_platform_share_basis_points.osx,192);
 assert.equal(Object.values(x.os_platform_share_basis_points).reduce((s,n)=>s+n,0),10000);
 assert.equal(x.combined_os_shares_reconciled,true);
 assert.equal(x.os_subversion_shares_may_be_added_to_platform_totals,false);
});
test('Five selected language rows are a subset, not a buyer census or nationality distribution',()=>{
 const x=audit(good());
 assert.equal(x.selected_language_subtotal_basis_points,7780);
 assert.equal(x.unlisted_languages_combined_basis_points,2220);
 assert.equal(x.non_english_survey_language_share_basis_points,6580);
 assert.equal(x.selected_language_rows_are_an_exhaustive_named_table,false);
 assert.equal(x.language_is_a_purchase_country,false);
 assert.equal(x.operating_system_is_a_purchase_country,false);
});
test('Survey shares do not identify monthly paid customer count or localization ROI',()=>{
 const x=audit(good());
 for(const key of ['actual_survey_respondent_count','matched_platform_monthly_active_users',
  'monthly_unique_paying_customer_counts','total_buyer_spend_by_platform',
  'publisher_income_by_survey_segment','localization_caused_paid_sales'])
  assert.equal(x[key],null,key);
 assert.equal(x.survey_respondents_are_verified_paying_customers,false);
 assert.equal(x.merchant_or_account_data_processed,false);
 assert.equal(doc.official_snapshot.respondents_n,null);
 assert(Object.values(doc.unknown).every(x=>x===null));
});
test('Mixed platform-specific percentages and nested OS versions cannot be silently summed',()=>{
 const a=good();a.platform_view='linux_only';
 assert.throws(()=>audit(a),/Explicit public survey/);
 const b=good();b.os_platform_share_basis_points.arch_linux=33;
 assert.throws(()=>audit(b),/Explicit public survey/);
 const c=good();c.os_platform_share_basis_points.windows=9502;
 assert.throws(()=>audit(c),/must total 100/);
});
test('Survey month and observation date must be valid and temporally ordered',()=>{
 const a=good();a.survey_month='2026-11';
 assert.throws(()=>audit(a),/Explicit public survey/);
 const b=good();b.observed_on='2026-02-30';
 assert.throws(()=>audit(b),/Explicit public survey/);
 const c=good();c.survey_month='2026-13';
 assert.throws(()=>audit(c),/Explicit public survey/);
});
test('Language shares cannot exceed all observations, or contain user-level metadata',()=>{
 const a=good();a.selected_language_share_basis_points.english=9000;
 assert.throws(()=>audit(a),/Selected disjoint language shares/);
 for(const extra of [{country:'MX'},{buyer_account_id:'private'},{paid_sales:10}]){
  assert.throws(()=>audit({...good(),...extra}),/Explicit public survey/);
 }
 const b=good();b.selected_language_share_basis_points.chinese_language_country='CN';
 assert.throws(()=>audit(b),/Explicit public survey/);
 const c=good();c.selected_language_share_basis_points.english=3420.5;
 assert.throws(()=>audit(c),/Explicit public survey/);
});
test('Public observation, source references and original 293 Steam task inventory stay joined',()=>{
 assert.equal(doc.reviewed_at,'2026-10-30');
 assert.equal(doc.official_snapshot.reported_month,'2026-09');
 const src=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(doc.source_ids.length,3);
 assert.equal(doc.claim_ids.length,8);
 for(const s of doc.source_ids)assert(src.has(s),s);
 for(const id of doc.claim_ids){
  const c=claims.get(id);assert(c,id);
  assert(c.source_ids.length&&c.source_ids.every(s=>src.has(s)));
 }
 const tasks=[...p.detail_tasks,...q.queues.flatMap(x=>x.tasks)];
 assert.equal(tasks.length,293);
 assert.equal(new Set(tasks.map(t=>t.id)).size,293);
 for(const id of ["identity/audience","steam/identity/document-store-geography-and-languages","steam/risk/study-operating-systems-and-compatibility","steam/discovery/analyze-languages-and-localization-discovery","steam/market/estimate-available-paid-buyer-population"]){
  const task=tasks.find(t=>t.id===id);assert(task,id);
  assert(task.evidence.includes('ontology/steam/september-2026-voluntary-hardware-language-survey-buyer-boundaries.md'));
  assert(task.evidence.includes('ontology/steam/september-2026-voluntary-hardware-language-survey-buyer-boundaries.json'));
 }
 const avg=tasks.reduce((s,t)=>s+(t.percent??t.progress),0)/293;
 assert.equal(p.progress_percent,Math.round(avg));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {evaluateMatchedFormatEconomics} from '../site/format-unit-economics.mjs';
const read=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
const data=await Promise.all(['ontology/youtube/format-unit-economics-2026.json','ontology/youtube/watch-page-ad-accounting.json','ontology/youtube/shorts-pool-economics.json','specimens/youtube.json'].map(read));
const [model,watch,shorts,dossier]=data;
const example=()=>({
 month:'2026-10',currency:'MXN',country:'MX',common_cash_overhead_unallocated:12,
 long_form:{watch_page_module_accepted:true,eligible_public_video:true,eligible_net_ad_revenues:200,
  video_duration_seconds:480,ad_slot_mode:'combined',
  production_cash_paid:23,distribution_cash_paid:7,production_hours:12,distribution_hours:3},
 shorts:{shorts_module_accepted_before_activity:true,content_eligible:true,
  period_is_authorized_country_eligible_engaged_views:true,
  country_creator_pool:1000,creator_eligible_engaged_views:100,total_eligible_engaged_views:1000,
  production_cash_paid:10,distribution_cash_paid:5,production_hours:4,distribution_hours:1}
});
const calc=(v)=>evaluateMatchedFormatEconomics(model,watch,shorts,v);
test('Independent official bases remain valid without observed creator money',()=>{
 const known=new Set(dossier.evidence.map(x=>x.id));
 assert(model.source_ids.every(id=>known.has(id)));
 assert.equal(model.modes[0].contract_share,0.55);
 assert.equal(model.modes[1].contract_share,0.45);
 assert.equal(model.modes[0].midroll.minimum_duration_seconds,480);
 assert.equal(model.modes[0].midroll.impressions_per_slot,null);
 assert.equal(model.observed_creator_earnings,null);
 assert(model.modes.every(x=>x.net_profit===null));
});
test('Hypothetical 55-percent eligible-net and 45-percent allocated-pool bases use disjoint cost and labor inputs',()=>{
 const x=calc(example());
 assert.equal(x.long_form.conditional_creator_contract_share,110);
 assert.equal(x.shorts.conditional_creator_contract_share,45);
 assert.equal(x.long_form.paid_direct_cash_costs,30);
 assert.equal(x.shorts.paid_direct_cash_costs,15);
 assert.equal(x.long_form.conditional_contribution_after_direct_cash_costs,80);
 assert.equal(x.shorts.conditional_contribution_after_direct_cash_costs,30);
 assert.equal(x.long_form.recorded_work_hours,15);
 assert.equal(x.shorts.recorded_work_hours,5);
 assert.equal(x.long_form.conditional_contribution_per_work_hour,80/15);
 assert.equal(x.shorts.conditional_contribution_per_work_hour,6);
 assert.equal(x.common_cash_overhead_unallocated,12);
 assert.equal(x.actual_creator_income,null);
 assert.equal(x.long_form.net_profit,null);
 assert.equal(x.causal_format_advantage,null);
});
test('479 seconds is not a mid-roll eligible duration but does not disqualify ordinary watch-page ads',()=>{
 const below=example();below.long_form.video_duration_seconds=479;
 const b=calc(below);
 assert.equal(b.long_form.midroll_duration_gate_satisfied,false);
 assert.equal(b.long_form.conditional_creator_contract_share,110);
 assert.equal(b.long_form.midroll_ad_served,null);
 const exact=calc(example());
 assert.equal(exact.long_form.midroll_duration_gate_satisfied,true);
 assert.equal(exact.long_form.midroll_ad_served,null);
});
test('Reject invalid denominators, ineligible rights, invalid cost and implausibly precise money',()=>{
 const bad=example();bad.shorts.period_is_authorized_country_eligible_engaged_views=false;
 assert.throws(()=>calc(bad),/Raw or cross-country/);
 const privateViews=example();privateViews.shorts.reported_public_views=12345;
 assert.throws(()=>calc(privateViews),/Public views/);
 const cpm=example();cpm.long_form.advertiser_cpm=19;
 assert.throws(()=>calc(cpm),/advertiser CPM/);
 const noModule=example();noModule.long_form.watch_page_module_accepted=false;
 assert.throws(()=>calc(noModule),/eligibility/);
 const noCost=example();delete noCost.shorts.distribution_cash_paid;
 assert.throws(()=>calc(noCost),/Missing or invalid/);
 const precision=example();precision.long_form.production_cash_paid=1.001;
 assert.throws(()=>calc(precision),/cents precision/);
 const invalidMonth=example();invalidMonth.month='2027-02';
 assert.throws(()=>calc(invalidMonth),/pre-February/);
 const unknownMode=example();unknownMode.long_form.ad_slot_mode='imaginary';
 assert.throws(()=>calc(unknownMode),/Invalid long-form/);
});
test('Zero work hours produce unknown diagnostic, never a wage or infinity',()=>{
 const x=example();x.shorts.production_hours=0;x.shorts.distribution_hours=0;
 const r=calc(x);
 assert.equal(r.shorts.conditional_contribution_per_work_hour,null);
 assert.equal(r.shorts.cash_received,null);
});

import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticSteamForecastPanel as audit} from '../site/steamforecast-lever-panel-audit.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=load('ontology/steam/steamforecast-selected-lever-panel-provenance-and-reproducibility-2026.json');
const d=load('specimens/steam.json'),p=load('plans/steam.json'),q=load('queues/steam.json');
const sample=()=>({fixture_id:'fixture-public-study-example',selected_rows:10403,quality_B:2734,quality_C:7652,quality_D:17,
 log_example_cents:353376223,log_example_reported:19.683043837714514,
 report_localization_min:5,dataset_localization_min:10,model_has_verified_merchant_sales:false});
test('Source-quality groups partition selected measurable games, never all Steam games',()=>{
 const r=audit(sample());assert.equal(r.selected_modelled_rows,10403);
 assert.equal(r.quality_source_counts_match,true);
 assert.equal(study.dataset_card.complete_first_paid_release_frame,false);
 assert.equal(study.dataset_card.observed_paid_weekone_sales,null);
});
test('Public examples match natural log rather than claimed base-ten scale',()=>{
 for(const e of study.dataset_card.displayed_sample_cents_and_log){
   const r=audit({...sample(),log_example_cents:e.derived_week1_cents,log_example_reported:e.reported_log});
   assert.equal(r.log_field_matches_natural_within_rounding,true);
   assert.equal(r.log_field_matches_base10_within_rounding,false);
 }
});
test('Five versus ten languages and omitted covariates are not silently reconciled',()=>{
 const r=audit(sample());assert.equal(r.public_localization_threshold_disagrees,true);
 assert.equal(study.localization_definition_conflict.actual_model_treatment_rule_confirmed,null);
 assert.equal(study.public_covariate_reproduction.internal_model_features_confirmed,null);
});
test('No causal merchant outcomes, zero-sales rate or publisher profits can be derived',()=>{
 const r=audit(sample());for(const k of ['publicly_identified_paid_game_launch_median','actual_merchant_firstweek_gross',
  'causal_paid_sales_effect','developer_net_income','observed_zero_paid_sale_fraction','actual_studio_profit'])
   assert.equal(r[k],null,k);
 assert(Object.values(study.not_identified).every(v=>v===null));
});
test('Invalid quality counts and extra financial identifiers cannot enter public model',()=>{
 for(const bad of [{quality_D:18},{private_partner_id:'foo'},{actual_paid_usd:25},
 {selected_rows:0},{quality_B:-1},{report_localization_min:1.5},{model_has_verified_merchant_sales:true},
 {log_example_cents:0},{log_example_reported:Infinity}])
  assert.throws(()=>audit({...sample(),...bad}));
 assert.throws(()=>audit([10403,2734,7652,17]));
});
test('All evidence links exist and original 293-task inventory is preserved',()=>{
 const src=new Set(d.evidence.map(s=>s.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(study.source_ids.length,3);assert.equal(study.claim_ids.length,11);
 for(const id of study.source_ids)assert(src.has(id));
 for(const id of study.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>src.has(s)),id);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {evaluateNichePilot} from '../site/niche-pilot-budget.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
const plan={pilot_id:'fixture-only',topic:'synthetic tutorial',format:'horizontal_video',currency:'USD',
 start_date:'2026-10-01',end_date:'2026-10-31',planned_episodes:3,maximum_new_cash_cents:5000,
 maximum_total_labor_hours:12,primary_metric:'impressions',minimum_eligible_exposures:100};
const attempt=(id,status='published',extra={})=>({
 episode_id:id,status,attempt_date:'2026-10-07',
 new_equipment_cash_cents:0,third_party_assets_cash_cents:0,contractor_cash_cents:0,software_cash_cents:0,
 network_power_cash_cents:0,marketing_cash_cents:0,other_cash_cents:0,allocated_owned_gear_usage_cents:0,
 hours:{research:0,writing:0,recording:0,editing:0,artwork:0,publishing:0,moderation:0,marketing:0,administration:0},
 exposures:null,...extra});
test('Pilot uses existing cited video-format and Analytics sources, no participants',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/niche-pilot-budget-protocol.json'),load('specimens/youtube.json')]);
 assert(m.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
 assert.equal(m.research_inputs_observed.length,0);
 assert.equal(m.real_pilot_results,null);
 assert.equal(m.required_attempt_cost_fields.length,8);
 assert.equal(m.required_attempt_hours_fields.length,9);
});
test('Separate spent new cash, previously owned equipment allocation, labor and abandoned work',()=>{
 const result=evaluateNichePilot(plan,[
  attempt('a','published',{software_cash_cents:2000,allocated_owned_gear_usage_cents:300,
   hours:{research:2,writing:1,recording:1,editing:2,artwork:0,publishing:0,moderation:0,marketing:0,administration:0}}),
  attempt('b','abandoned',{contractor_cash_cents:1000,allocated_owned_gear_usage_cents:200,
   hours:{research:1,writing:1,recording:0,editing:0,artwork:0,publishing:0,moderation:0,marketing:0,administration:0}})
 ],{as_of:'2026-10-20'});
 assert.equal(result.new_cash_spent_cents,3000);
 assert.equal(result.allocated_owned_gear_use_cents,500);
 assert.equal(result.cash_plus_allocated_use_cents,3500);
 assert.equal(result.labor_hours,8);
 assert.equal(result.published_episodes,1);
 assert.equal(result.abandoned_episodes,1);
 assert.equal(result.can_authorize_another_attempt,true);
 assert.equal(result.evidence_exposure_count,null);
 assert.equal(result.net_creator_profit,null);
 assert.equal(result.audience_success,null);
});
test('Cash cap or hour cap forbids additional attempts including when exceeded',()=>{
 const capped=evaluateNichePilot(plan,[attempt('a','attempted',{new_equipment_cash_cents:5000})],{as_of:'2026-10-15'});
 assert.equal(capped.can_authorize_another_attempt,false);
 assert(capped.stop_reasons.includes('cash_budget_reached'));
 assert.equal(capped.new_cash_overrun_cents,0);
 const over=evaluateNichePilot(plan,[attempt('a','attempted',{new_equipment_cash_cents:5300})],{as_of:'2026-10-15'});
 assert.equal(over.new_cash_overrun_cents,300);
 const hours=evaluateNichePilot(plan,[attempt('a','abandoned',{hours:{research:12,writing:0,recording:0,editing:0,artwork:0,publishing:0,moderation:0,marketing:0,administration:0}})],{as_of:'2026-10-15'});
 assert.equal(hours.can_authorize_another_attempt,false);
 assert(hours.stop_reasons.includes('labor_cap_reached'));
});
test('Real matched owner analytics is necessary but never enough to assert causal commercial success',()=>{
 const valid=attempt('a','published',{exposures:100,exposure_metric:'impressions',own_analytics_authorized:true});
 const observed=evaluateNichePilot(plan,[valid],{as_of:'2026-10-15'});
 assert.equal(observed.exposure_gate_satisfied,true);
 assert.equal(observed.audience_success,null);
 assert.equal(observed.representative_success_probability,null);
 assert.throws(()=>evaluateNichePilot(plan,[{...valid,exposure_metric:'views'}],{as_of:'2026-10-15'}),/Unverified/);
 assert.throws(()=>evaluateNichePilot(plan,[{...valid,own_analytics_authorized:false}],{as_of:'2026-10-15'}),/Unverified/);
 assert.throws(()=>evaluateNichePilot(plan,[attempt('a','abandoned',{exposures:100,own_analytics_authorized:true,exposure_metric:'impressions'})],{as_of:'2026-10-15'}),/Unpublished/);
});
test('Reject missing spend, date violations, duplicate episodes and undeclared inputs',()=>{
 const a=attempt('a');
 const missing={...a};delete missing.network_power_cash_cents;
 assert.throws(()=>evaluateNichePilot(plan,[missing],{as_of:'2026-10-15'}),/Missing/);
 assert.throws(()=>evaluateNichePilot(plan,[a,a],{as_of:'2026-10-15'}),/Duplicate/);
 assert.throws(()=>evaluateNichePilot(plan,[{...a,attempt_date:'2026-11-01'}],{as_of:'2026-11-01'}),/outside/);
 assert.throws(()=>evaluateNichePilot(plan,[a],{as_of:'2026-13-01'}),/explicit as_of/);
 assert.throws(()=>evaluateNichePilot({...plan,maximum_new_cash_cents:-1},[a],{as_of:'2026-10-15'}),/Invalid/);
 assert.throws(()=>evaluateNichePilot({...plan,primary_metric:'buyer_sales'},[a],{as_of:'2026-10-15'}),/Unsupported/);
});
test('Website exposes the measurement protocol without invented audience conclusions',async()=>{
 const site=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(site.includes('renderNichePilotBudget'));
 assert(site.includes('niche-pilot-budget-protocol.json'));
 assert(site.includes('not measured creator earnings or a guaranteed viable niche'));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {evaluateCreatorEntryGate,assessNoNewPurchaseClaims,evaluateCreatorAgeRoute} from '../site/creator-entry-gates.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Seven official feature gates reference existing registered sources, not new account data',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/creator-entry-gates-2026.json'),load('specimens/youtube.json')]);
 const ids=new Set(d.evidence.map(x=>x.id));
 assert.equal(m.activity_gates.length,7);
 assert(m.source_ids.every(id=>ids.has(id)));
 assert(m.activity_gates.every(g=>g.source_ids.every(id=>ids.has(id))));
 assert.equal(m.account_evaluations_performed.length,0);
 assert.equal(m.measured_real_cash_costs,null);
 assert.equal(m.verified_creator_income,null);
});
test('Ordinary video publishing does not demand mobile live subscribers or advance identity gates',async()=>{
 const m=await load('ontology/youtube/creator-entry-gates-2026.json');
 const ok={channel_exists:true,standard_features_allowed:true};
 assert.equal(evaluateCreatorEntryGate(m,'standard_upload',ok,0).status,'passes_documented_gates');
 assert.equal(evaluateCreatorEntryGate(m,'standard_upload',{channel_exists:true},0).status,'unknown');
 assert.equal(evaluateCreatorEntryGate(m,'standard_upload',{channel_exists:false,standard_features_allowed:true},0).status,'ineligible_by_stated_gates');
 assert.equal(evaluateCreatorEntryGate(m,'long_upload_custom_thumbnail',{...ok,phone_verified:false},0).status,'ineligible_by_stated_gates');
 const live={channel_exists:true,phone_verified:true,live_access_enabled:true,age_at_least_16:true,no_recent_stream_restriction:true,mobile_os_supported:true};
 assert.equal(evaluateCreatorEntryGate(m,'desktop_live',live,0).status,'passes_documented_gates');
 assert.equal(evaluateCreatorEntryGate(m,'mobile_live',live,49).status,'ineligible_by_stated_gates');
 assert.equal(evaluateCreatorEntryGate(m,'mobile_live',live,50).status,'passes_documented_gates');
 assert.equal(evaluateCreatorEntryGate(m,'mobile_live',live,undefined).status,'unknown');
 assert.equal(evaluateCreatorEntryGate(m,'receive_ypp_revenue',{}).status,'unknown');
});
test('No mandatory new purchase does not establish no labor, no fees, or a payout',async()=>{
 const m=await load('ontology/youtube/creator-entry-gates-2026.json');
 const yes=assessNoNewPurchaseClaims(m,'ordinary_publish_does_not_require_new_paid_software_or_equipment');
 assert.equal(yes.supported,true);assert.equal(yes.total_creator_cost,null);
 for(const claim of ['real_cost_is_zero','guaranteed_earnings','guaranteed_ypp_approval','streaming_requires_zero_subscribers'])
  assert.equal(assessNoNewPurchaseClaims(m,claim).supported,false);
 assert.equal(m.cost_categories.length,7);
 assert(m.cost_categories.every(x=>x.amount===null));
 assert.equal(m.timelines[2].day_upper_bound,null);
});
test('Dossier renders the rule stages and uncertainty boundary',async()=>{
 const app=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(app.includes('renderCreatorEntryGates'));
 assert(app.includes('creator-entry-gates-2026.json'));
 assert(app.includes('not actual account approval or creator income'));
});

test('Age gates split Brazilian channel supervision, age-16 live streaming and age-18 AdSense payees',async()=>{
 const m=await load('ontology/youtube/creator-entry-gates-2026.json');
 const d=await load('specimens/youtube.json');
 assert.equal(m.age_and_guardian_routes.length,4);
 assert(m.age_and_guardian_routes.every(x=>x.source_ids.every(id=>d.evidence.some(y=>y.id===id))));
 assert.equal(evaluateCreatorAgeRoute(m,'channel_creation_brazil_under16',{age:15,region:'BR',supervisionLinked:false}).status,'needs_parent_supervision');
 assert.equal(evaluateCreatorAgeRoute(m,'channel_creation_brazil_under16',{age:15,region:'BR',supervisionLinked:true}).status,'passes_documented_supervision_gate');
 assert.equal(evaluateCreatorAgeRoute(m,'channel_creation_brazil_under16',{age:15,region:'MX',supervisionLinked:true}).status,'unknown_jurisdiction_rules');
 assert.equal(evaluateCreatorAgeRoute(m,'livestreaming_min16',{age:15}).status,'under_16_not_eligible');
 assert.equal(evaluateCreatorAgeRoute(m,'livestreaming_min16',{age:16}).status,'passes_age_requirement_only');
 assert.equal(evaluateCreatorAgeRoute(m,'direct_adsense_min18',{age:17}).status,'direct_payee_under_18');
 assert.equal(evaluateCreatorAgeRoute(m,'direct_adsense_min18',{age:18}).status,'passes_direct_payee_age_only');
 assert.equal(evaluateCreatorAgeRoute(m,'guardian_adsense_under18',{age:17,approvedGuardianAdSense:true}).status,'adult_payee_route_condition_met');
 assert.equal(evaluateCreatorAgeRoute(m,'guardian_adsense_under18',{age:17,approvedGuardianAdSense:false}).status,'no_approved_adult_payee');
 assert.equal(evaluateCreatorAgeRoute(m,'guardian_adsense_under18',{age:17}).status,'unknown');
 assert.equal(evaluateCreatorAgeRoute(m,'guardian_adsense_under18',{age:17,approvedGuardianAdSense:true}).actual_approval,null);
 assert.equal(m.unmeasured_local_ages_outside_brazil,null);
});

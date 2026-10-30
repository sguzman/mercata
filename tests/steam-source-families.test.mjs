import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSteamSourceFamilies as audit} from '../scripts/steam-source-families.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const base=()=>({d:load('specimens/steam.json'),registry:load('ontology/steam/source-families.json')});
test('Five reused cohort families plus one conflicting vendor version are registered',()=>{
 const {d,registry}=base(),r=audit(d.evidence,d.claims,registry);
 assert.equal(r.valid,true,r.errors.join('; '));
 assert.equal(r.registered_reused_cohort_families,5);
 assert.equal(r.registered_conflicting_version_families,1);
 assert.equal(registry.families.length,6);
 assert.equal(r.related_distinct_sample_documents,4);
 assert.equal(registry.families[4].relation,'same_title_nested_cumulative_observations');
 assert.equal(r.unique_data_studies_in_entire_steam_dossier,null);
 assert.equal(r.verified_paid_order_count,null);
});
test('Recognizes sharing of 1312 and 10403 data while retaining different sample frames',()=>{
 const {d,registry}=base(),families=registry.families;
 assert.deepEqual(families.map(x=>x.documented_selected_games),[1312,10403,1230,4,1,null]);
 assert.equal(registry.related_documents_not_independent_replications[0].relation,
 'same_publisher_review_history_collection_but_distinct_eligibility_filter');
 assert.deepEqual(families[5].reported_population_counts,[7478,6169]);
 assert.equal(audit(d.evidence,d.claims,registry).valid,true);
});
test('A cited source cannot be silently assigned to two independently counted cohorts',()=>{
 const {d,registry}=base();
 registry.families[1].source_ids.push(registry.families[0].source_ids[0]);
 const r=audit(d.evidence,d.claims,registry);
 assert.equal(r.valid,false);assert(r.errors.some(x=>x.includes('multiple primary families')));
});
test('Changing a registered source, inventing source URLs, or promoting related documents fails closed',()=>{
 for(const mutation of [
  (d,r)=>{r.families[0].source_ids[0]='missing-source'},
  (d,r)=>{r.families[1].documented_selected_games=-1},
  (d,r)=>{r.related_documents_not_independent_replications[0].related_family_id='missing-family'},
  (d,r)=>{r.related_documents_not_independent_replications[0].source_id=r.families[0].source_ids[0]},
  (d,r)=>{r.independent_study_count=3},
  (d,r)=>{r.authenticated_merchant_sales_records=10403}
 ]){
  const {d,registry}=base();mutation(d,registry);const out=audit(d.evidence,d.claims,registry);
  assert.equal(out.valid,false,JSON.stringify(out));
 }
});
test('Shared documents cannot be duplicated under another URL fragment without registration',()=>{
 const {d,registry}=base();
 const copy={...d.evidence[0],id:'synthetic-duplicate-source',url:d.evidence[0].url+'#copy'};
 d.evidence.push(copy);
 const r=audit(d.evidence,d.claims,registry);
 assert.equal(r.valid,false);assert(r.errors.some(x=>x.includes('Unregistered normalized duplicate URL')));
});

test('Incompatible vendor counts are explicit and cannot be disguised as an independently counted cohort',()=>{
 const {d,registry}=base(),last=registry.families[5];
 assert.equal(last.relation,'same_vendor_conflicting_report_versions');
 assert.equal(last.documented_selected_games,null);
 const bad=[()=>{last.documented_selected_games=7478},()=>{last.reported_population_counts=[7478,7478]},()=>{last.reported_population_counts=[7478,-1]}];
 for(const mutate of bad){const {d,registry}=base();const last=registry.families[5];if(mutate===bad[0])last.documented_selected_games=7478;else if(mutate===bad[1])last.reported_population_counts=[7478,7478];else last.reported_population_counts=[7478,-1];const r=audit(d.evidence,d.claims,registry);assert.equal(r.valid,false);assert(r.errors.some(x=>x.includes('Incomplete reused sample family')));}
});

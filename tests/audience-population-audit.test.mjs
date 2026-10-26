import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditAudiencePopulation,comparePopulationEvidence} from '../site/audience-population-audit.mjs';
const load=async x=>JSON.parse(await readFile(new URL('../'+x,import.meta.url),'utf8'));
test('Survey and ad reach crosswalk preserves source provenance and distinct denominators',async()=>{
 const [data,dossier]=await Promise.all([load('ontology/youtube/audience-population-crosswalk.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditAudiencePopulation(data,new Set(dossier.evidence.map(x=>x.id))),{valid:true,errors:[]});
 assert(Object.values(data.unmeasured).every(x=>x===null));
});
test('Never subtract daily, monthly and ad metrics as if they were one population',async()=>{
 const data=await load('ontology/youtube/audience-population-crosswalk.json');
 for(const [i,j] of [[0,1],[0,2],[2,4],[4,5],[2,3]]){
  const r=comparePopulationEvidence(data.observations[i],data.observations[j]);
  assert.equal(r.status,'incomparable');assert.equal(r.difference,null);
 }
});
test('A mismatched unit or falsely counted global population cannot pass',async()=>{
 const [data,dossier]=await Promise.all([load('ontology/youtube/audience-population-crosswalk.json'),load('specimens/youtube.json')]);
 data.observations[0].equivalent_to_global_mau=true;data.unmeasured.global_unique_dau=1;
 const x=auditAudiencePopulation(data,new Set(dossier.evidence.map(x=>x.id)));
 assert.equal(x.valid,false);assert(x.errors.includes('false global MAU'));assert(x.errors.includes('invented platform population'));
});

test('Selected October 2025 ad-planner country comparison cannot claim monthly active usage',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/audience-population-crosswalk.json'),load('specimens/youtube.json')]);
 const p=m.ad_reach_country_comparison,ids=new Set(d.evidence.map(x=>x.id));
 assert.deepEqual(auditAudiencePopulation(m,ids),{valid:true,errors:[]});
 assert.equal(p.period,'2025-10');
 assert.deepEqual(p.countries.map(x=>[x.iso2,x.ad_reach_million]),[
 ['IN',500],['US',254],['ID',151],['BR',150],['MX',85],['JP',78.5],['PH',59.6]]);
 assert.equal(p.rank_scope,'within_these_seven_country_estimates_only_not_global_rank');
 assert.equal(p.validity_gates.actual_monthly_active_use_rank,false);
 assert(Object.values(p.unmeasured).every(x=>x===null));
});
test('Population audit prevents relabeling ad-reach ranks as MAUs or adding unregistered countries',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/audience-population-crosswalk.json'),load('specimens/youtube.json')]);
 const s=new Set(d.evidence.map(x=>x.id));
 const a=structuredClone(m);a.ad_reach_country_comparison.provider_reported_monthly_active_users=true;
 assert(auditAudiencePopulation(a,s).errors.includes('mislabelled country reach panel as active users'));
 const b=structuredClone(m);b.ad_reach_country_comparison.countries[0].source_id='unregistered';
 assert(auditAudiencePopulation(b,s).errors.includes('invalid selected country ranking or source'));
 const c=structuredClone(m);c.ad_reach_country_comparison.unmeasured.true_monthly_active_user_rank=1;
 assert(auditAudiencePopulation(c,s).errors.includes('invented country active-user rank'));
});

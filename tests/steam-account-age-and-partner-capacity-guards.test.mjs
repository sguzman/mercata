import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {classifySyntheticSteamSubscriberAndPartnerAge as classify} from '../site/steam-account-age-and-partner-capacity-guards.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=load('ontology/steam/steam-subscriber-minimum-age-versus-partner-signatory-capacity-2026.json'),d=load('specimens/steam.json'),p=load('plans/steam.json'),q=load('queues/steam.json');
test('Below 13 barred from subscribing; 13 and 18 do not establish partner eligibility',()=>{
 for(const a of x.synthetic_cases){
  const r=classify({fixture_age_years:a.age_years});
  assert.equal(r.steam_subscriber_general_age_gate,a.subscriber_age_gate);
  assert.equal(r.steamworks_distribution_signatory_eligible,null);
  assert.equal(r.steamworks_partner_account_approved,null);
  assert.equal(r.actual_publishing_sales,null);
  assert.equal(r.actual_publisher_profit,null);
 }
});
test('Local restrictions, legal capacity and bank/tax approvals remain unknown',()=>{
 const a=classify({fixture_age_years:30});
 assert.equal(a.additional_country_registration_restrictions_verified,false);
 assert.equal(a.distribution_contract_capacity_verified,null);
 assert.equal(a.tax_and_bank_approval_verified,null);
 assert.equal(x.partner.universal_signatory_minimum_age_published_in_audited_docs,null);
 assert(Object.values(x.unknown).every(v=>v===null));
});
test('No real account records or invalid synthetic ages can enter',()=>{
 assert.throws(()=>classify({fixture_age_years:-1}),/Synthetic age/);
 assert.throws(()=>classify({fixture_age_years:121}),/Synthetic age/);
 assert.throws(()=>classify({fixture_age_years:13.5}),/Synthetic age/);
 assert.throws(()=>classify({fixture_age_years:'18'}),/Synthetic age/);
});
test('Dated evidence and all original Steam tasks remain consistent',()=>{
 const s=new Set(d.evidence.map(x=>x.id)),c=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(x.source_ids.length,4);assert.equal(x.claim_ids.length,9);
 for(const id of x.source_ids)assert(s.has(id),id);
 for(const id of x.claim_ids){assert(c.has(id),id);assert(c.get(id).source_ids.every(k=>s.has(k)),id);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((sum,n)=>sum+n,0)/293));
 assert(p.detail_tasks.find(t=>t.id==='steam/access/identify-developer-age-and-legal-capacity').evidence.includes('ontology/steam/steam-subscriber-minimum-age-versus-partner-signatory-capacity-2026.json'));
});

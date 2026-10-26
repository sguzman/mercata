import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {inspectCountryAccess,inferCountryVideoRights,auditRegionalAvailabilityMechanisms} from '../site/country-policy-crosswalk-audit.mjs';
const read=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Regional program and payment method lists have independent official source IDs',async()=>{
 const [m,d,c]=await Promise.all([read('ontology/youtube/country-policy-and-payout-crosswalk-2026.json'),read('specimens/youtube.json'),read('ontology/youtube/country-eligibility-payments.json')]);
 assert(m.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
 assert.deepEqual(m.observations.map(x=>x.country_code),['MX','US','GB']);
 assert.deepEqual(m.observations.map(x=>x.payment_methods_by_address.eft),[true,true,true]);
 assert.deepEqual(m.observations.map(x=>x.payment_methods_by_address.wire),[true,false,true]);
 assert.deepEqual(m.currency_examples.map(x=>x.payout_minimum),[1200,100,60]);
 assert.equal(m.real_account_data_accessed,false);
 assert(Object.values(m.unmeasured).every(x=>x===null));
 assert.equal(c.country_records.length,3);
});
test('Account reporting currency never follows country automatically',async()=>{
 const m=await read('ontology/youtube/country-policy-and-payout-crosswalk-2026.json');
 const mx=inspectCountryAccess(m,{country_code:'MX'});
 assert.equal(mx.valid,true);
 assert.equal(mx.reporting_currency,null);
 assert.equal(mx.documented_account_currency_minimum,null);
 assert.equal(mx.actual_account_payment_method,null);
 assert.equal(inspectCountryAccess(m,{country_code:'MX',account_currency:'USD'}).documented_account_currency_minimum,100);
 assert.equal(inspectCountryAccess(m,{country_code:'MX',account_currency:'MXN'}).documented_account_currency_minimum,1200);
 assert.equal(inspectCountryAccess(m,{country_code:'GB',account_currency:'ZZZ'}).documented_account_currency_minimum,null);
 assert.equal(inspectCountryAccess(m,{country_code:'FR'}).valid,false);
});
test('Geographic Content ID possibility is not an observed video restriction or creator cash loss',async()=>{
 const m=await read('ontology/youtube/country-policy-and-payout-crosswalk-2026.json');
 const e=inferCountryVideoRights(m,{country_code:'US',content_id_action:'block'});
 assert.equal(e.allowed,false);assert.equal(e.revenue_loss,null);
 const a=inspectCountryAccess(m,{country_code:'US',feature:'shopping_affiliate'});
 assert.equal(a.claimed_feature_approved,null);
 assert.equal(a.video_rights_policy_by_country,null);
 assert.equal(a.observed_creator_income,null);
});
test('Research site distinguishes territory eligibility and per-account unknowns',async()=>{
 const app=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(app.includes('renderCountryPolicyCrosswalk'));
 assert(app.includes('country-policy-and-payout-crosswalk-2026.json'));
 assert(app.includes('not verified account approval or creator income'));
});

test('Official content-availability mechanisms distinguish owner licensing, local law and music claimant policy',async()=>{
 const [m,d]=await Promise.all([read('ontology/youtube/country-policy-and-payout-crosswalk-2026.json'),read('specimens/youtube.json')]);
 const known=new Set(d.evidence.map(x=>x.id)),r=m.region_specific_video_availability;
 assert.deepEqual(auditRegionalAvailabilityMechanisms(m,known),{valid:true,errors:[]});
 assert.equal(r.policy_review_date,'2026-10-25');
 assert.deepEqual(r.mechanisms.map(x=>x.id),['video_owner_licensing_region','platform_local_law','content_id_claimant']);
 assert.deepEqual(r.music_claim_policy_outcomes.map(x=>x.id),['monetize','block_worldwide','block_some_territories']);
 assert.equal(r.all_three_reference_countries_have_verified_claimed_video_records,false);
 assert.equal(r.actual_settled_payout_by_territory,null);
 assert.equal(r.ypp_country_listing_implies_viewer_video_availability,false);
 assert(d.claims.some(c=>c.id==='youtube-country-unavailability-rights-law-and-claims-2026'&&c.source_ids.every(id=>known.has(id))));
});
test('Country availability audit rejects inferred claims, royalties or local-law cases',async()=>{
 const [m,d]=await Promise.all([read('ontology/youtube/country-policy-and-payout-crosswalk-2026.json'),read('specimens/youtube.json')]);
 const sources=new Set(d.evidence.map(x=>x.id));
 const a=structuredClone(m);a.region_specific_video_availability.mechanisms[1].observed_territory_codes=['MX'];
 assert(auditRegionalAvailabilityMechanisms(a,sources).errors.includes('unsupported actual video-territory mechanism or exposure'));
 const b=structuredClone(m);b.region_specific_video_availability.music_claim_policy_outcomes[0].uploader_revenue_share_percent=50;
 assert(auditRegionalAvailabilityMechanisms(b,sources).errors.includes('invented claimant earnings or music policy'));
 const c=structuredClone(m);c.region_specific_video_availability.ypp_country_listing_implies_viewer_video_availability=true;
 assert(auditRegionalAvailabilityMechanisms(c,sources).errors.includes('unsupported country payout or legal inference'));
});

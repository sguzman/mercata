import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditTrafficReferralMatrix} from '../site/traffic-referral-audit.mjs';
const load=async p=>JSON.parse(await fs.readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Primary-source Analytics referral types retain origin, consent and monetization boundaries',async()=>{
 const [model,spec]=await Promise.all([load('ontology/youtube/traffic-concentration.json'),load('specimens/youtube.json')]);
 const known=new Set(spec.evidence.map(x=>x.id));
 assert.deepEqual(auditTrafficReferralMatrix(model,known),{valid:true,errors:[]});
 const entries=model.api_attribution_crosswalk.categories;
 assert.equal(entries.length,15);
 assert.equal(entries.find(x=>x.api_code==='EXT_URL').studio_group,'external');
 assert.equal(entries.find(x=>x.api_code==='SHORTS').origin,'shorts_vertical_feed');
 assert.equal(entries.find(x=>x.api_code==='SUBSCRIBER').subscription_status,'not_proven');
 assert(entries.every(x=>x.creator_income_by_source===null));
});
test('Unknown referral and owner data cannot be relabeled active subscribers, paid income or organic YouTube Search',async()=>{
 const [model,spec]=await Promise.all([load('ontology/youtube/traffic-concentration.json'),load('specimens/youtube.json')]);
 const source=new Set(spec.evidence.map(x=>x.id)),copy=()=>structuredClone(model);
 const a=copy();a.api_attribution_crosswalk.categories.find(x=>x.api_code==='EXT_URL').studio_group='youtube_search';
 assert(!auditTrafficReferralMatrix(a,source).valid);
 const b=copy();b.api_attribution_crosswalk.categories.find(x=>x.api_code==='SUBSCRIBER').subscription_status='SUBSCRIBED';
 assert(!auditTrafficReferralMatrix(b,source).valid);
 const c=copy();c.api_attribution_crosswalk.observed_creator_rows.push({views:123});
 assert(!auditTrafficReferralMatrix(c,source).valid);
 const d=copy();d.api_attribution_crosswalk.categories.find(x=>x.api_code==='NO_LINK_OTHER').creator_income_by_source=4;
 assert(!auditTrafficReferralMatrix(d,source).valid);
});

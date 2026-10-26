import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditItchReferralChannels} from '../site/itch-referral-channel-audit.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const row={project_id:'synthetic',period:'2026-10',evidence_verified:true};
test('Same-period categorized events stay separate from purchases and human buyers',()=>{
 const z=auditItchReferralChannels({rows:[{...row,unit:'project_referral_view_event',channel:'external_search',count:12},{...row,unit:'project_referral_view_event',channel:'external_social_or_forum',count:8},{...row,unit:'purchase_referrer_event',channel:'external_search',count:1}]});
 assert.equal(z.valid,true);
 assert.equal(z.reported_event_counts_by_unit.project_referral_view_event,20);
 assert.equal(z.reported_event_counts_by_unit.purchase_referrer_event,1);
 assert.equal(z.unique_paying_customers,null);assert.equal(z.paid_customer_conversion,null);
});
test('Unverified channels and unproven direct referrals are not reclassified as measured',()=>{
 const r=auditItchReferralChannels({rows:[{...row,unit:'project_referral_view_event',channel:'verified_direct',count:4}]});
 assert.equal(r.valid,false);
 const k=auditItchReferralChannels({rows:[{...row,evidence_verified:false,unit:'project_referral_view_event',channel:'external_press_or_influencer',count:3}]});
 assert.equal(k.valid,false);
 const unknown=auditItchReferralChannels({rows:[{...row,evidence_verified:false,unit:'project_referral_view_event',channel:'unattributed',count:7}]});
 assert.equal(unknown.valid,true);
});
test('Cross-month and duplicative observational buckets cannot produce pooled source counts',()=>{
 const rows=[{...row,unit:'project_referral_view_event',channel:'external_search',count:10},{...row,unit:'project_referral_view_event',channel:'external_search',count:6}];
 assert.equal(auditItchReferralChannels({rows}).valid,false);
 assert.equal(auditItchReferralChannels({rows:[rows[0],{...rows[1],period:'2026-09'}]}).valid,false);
});
test('Referral study closes only its existing task without claiming paid population evidence',()=>{
 const x=read('ontology/itch-io/referral-source-channel-denominators-2026.json'),p=read('plans/itch-io.json'),d=read('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 const t=p.detail_tasks.find(x=>x.id==='itch-io/discovery/map-external-referrals');
 assert.equal(t.percent,100);assert.equal(t.status,'complete');
 assert(t.evidence.includes('tests/itch-referral-channel-audit.test.mjs'));
 assert.equal(x.real_research.unique_paying_buyers,null);
 assert.equal(x.real_research.causal_channel_effect,null);
});

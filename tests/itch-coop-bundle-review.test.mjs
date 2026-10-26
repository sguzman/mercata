import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {reviewItchCoopBundle} from '../site/itch-coop-bundle-review.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const members=[{id:'publisher_a',weight:2,project_count:1,approved:true,eligible_for_collected_payout:true},{id:'publisher_b',weight:1,project_count:1,approved:true,eligible_for_collected_payout:true}];
test('Simple weighted gross example reconciles to all cents but never computes settled seller proceeds',()=>{
 const r=reviewItchCoopBundle({participants:members,hypothetical_gross_cents:3000,single_tier_confirmed:true});
 assert.equal(r.participant_terms_ready_for_review,true);
 assert.deepEqual(r.illustrative_allocation.map(a=>a.illustrative_before_fees_cents),[2000,1000]);
 assert.equal(r.actual_bundle_published,false);assert.equal(r.actual_net_payout,null);
 assert.equal(r.individual_paid_game_orders,null);
});
test('Unapproved, ineligible and multilevel splits are blocked from simplified review',()=>{
 for(const part of [{...members[1],approved:false},{...members[1],eligible_for_collected_payout:false}]){
  const r=reviewItchCoopBundle({participants:[members[0],part],hypothetical_gross_cents:100,single_tier_confirmed:true});
  assert.equal(r.participant_terms_ready_for_review,false);assert.equal(r.illustrative_allocation,null);
 }
 const tier=reviewItchCoopBundle({participants:members,hypothetical_gross_cents:3000,single_tier_confirmed:false});
 assert.equal(tier.illustrative_allocation,null);
 assert.throws(()=>reviewItchCoopBundle({participants:[members[0],members[0]],hypothetical_gross_cents:100,single_tier_confirmed:true}));
});
test('Participation acceptance is sourced official policy without real sales or buyer access',()=>{
 const d=get('specimens/itch-io.json'),x=get('ontology/itch-io/coop-bundle-consent-and-splits-2026.json'),p=get('plans/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.equal(x.known_policy.all_participants_must_approve_before_publication,true);
 assert.equal(x.known_policy.large_bundles_defer_keys_if_project_count_greater_than,15);
 assert.equal(x.known_policy.pruning_pending_game_share_max_percent,15);
 assert.equal(x.actual_bundle_created,false);
 assert.equal(x.unknown.platformwide_coop_bundle_purchase_count,null);
 const task=p.detail_tasks.find(t=>t.id==='itch-io/rights/audit-bundled-distribution-terms');
 assert.equal(task.percent,100);assert.equal(task.status,'complete');
 assert(task.evidence.includes('tests/itch-coop-bundle-review.test.mjs'));
});

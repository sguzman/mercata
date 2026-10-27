import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditMatchedItchFunnel} from '../site/itch-matched-funnel-audit.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const kinds={impression:'project_impression_event',page_view:'project_page_view_event',checkout_start:'positive_price_checkout_attempt',paid_order:'completed_positive_price_game_order',refund:'refunded_positive_price_game_order'};
const counts={impression:1000,page_view:100,checkout_start:12,paid_order:5,refund:1};
const row=event=>({event,unit:kinds[event],count:counts[event],project_id:'synthetic_public_label',release_id:'v1',offer_id:'full_price_usd',channel:'internal_search',attribution_method:'owner_verified_common_cohort',window_start_utc:'2026-10-01T00:00:00Z',window_end_utc:'2026-11-01T00:00:00Z'});
const sample=()=>({owner_authorized:true,aggregated_only:true,research_redistribution_allowed:true,same_attribution_cohort_verified:true,attribution_lag_days:7,rows:Object.keys(kinds).map(row)});
test('Aligned synthetic funnel reports refund-adjusted event rates but no buyer probability',()=>{
 const x=auditMatchedItchFunnel(sample());assert.equal(x.valid,true);
 assert.equal(x.retained_positive_price_orders,4);
 assert.equal(x.paid_order_events_per_page_view,0.04);
 assert.equal(x.paid_order_events_per_checkout_start,4/12);
 assert.equal(x.unique_paying_buyers,null);assert.equal(x.customer_conversion_probability,null);
 assert.equal(x.incremental_sales_lift,null);assert.equal(x.real_source_data_authenticated,false);
});
test('Referrer, period, offer, attribution and stage mismatches suppress any conversion ratio',()=>{
 for(const altered of [
  x=>x.rows[1].window_end_utc='2026-10-31T00:00:00Z',
  x=>x.rows[1].channel='external_social',
  x=>x.rows[2].offer_id='other_game',
  x=>x.rows[0].attribution_method='unverified',
  x=>x.rows.pop(),
  x=>x.rows[4].count=10,
  x=>x.rows.push({...x.rows[4]})
 ]){
  const a=sample();altered(a);const out=auditMatchedItchFunnel(a);
  assert.equal(out.valid,false);assert.equal(out.page_view_event_rate,null);
 }
 assert.throws(()=>auditMatchedItchFunnel({...sample(),owner_authorized:false}),/authorization/i);
 assert.throws(()=>auditMatchedItchFunnel({...sample(),same_attribution_cohort_verified:false}),/attribution/i);
});
test('Task closes only dated methodology and retains missing empirical buyer data',()=>{
 const a=read('ontology/itch-io/matched-impression-order-funnel-audit-2026.json');
 const s=read('specimens/itch-io.json');const p=read('plans/itch-io.json');const ids=new Set(s.evidence.map(x=>x.id));
 assert(a.source_ids.every(id=>ids.has(id)));assert.equal(a.real_data.authorized_reports,0);
 assert.equal(a.real_data.real_positive_price_game_orders,null);
 const t=p.detail_tasks.find(x=>x.id==='itch-io/discovery/build-impression-to-sale-funnel');
 assert.equal(t.percent,100);assert.equal(t.status,'complete');
 for(const f of ['ontology/itch-io/matched-impression-order-funnel-audit-2026.json','ontology/itch-io/matched-impression-order-funnel-audit-2026.md','site/itch-matched-funnel-audit.mjs','tests/itch-matched-funnel-audit.test.mjs'])assert(t.evidence.includes(f));
 assert.equal(p.total_tracked_tasks,244);
});

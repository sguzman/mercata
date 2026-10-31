import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditSyntheticSteamReviewRefundFlags as audit} from '../site/steam-review-refund-flag-audit.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=read('ontology/steam/steam-review-refund-flag-observation-not-purchase-refund-2026.json');
const make=()=>({fixture_id:'fixture-review-flags',
 query:{fixture_id:'fixture-review-flags',request:{
  service:'IUserReviewsService/GetAppReviews/v1',filter:1,languages:['all'],
  purchase_type:1,review_type:0,num_per_page:2,filter_offtopic_activity:false},
  pages:[
   {http_status:200,response_envelope:'response',cursor_in:'*',cursor_out:'fixture-cursor-a',
    num_reviews:2,returned_reviews_length:2,total_matching:3},
   {http_status:200,response_envelope:'response',cursor_in:'fixture-cursor-a',cursor_out:'fixture-cursor-b',
    num_reviews:1,returned_reviews_length:1,total_matching:3},
   {http_status:200,response_envelope:'response',cursor_in:'fixture-cursor-b',cursor_out:null,
    num_reviews:0,returned_reviews_length:0,total_matching:3}
  ]},
 flag_pages:[
  {cursor_in:'*',refunded_true:1,refunded_false:1,refunded_unobserved:0},
  {cursor_in:'fixture-cursor-a',refunded_true:0,refunded_false:0,refunded_unobserved:1},
  {cursor_in:'fixture-cursor-b',refunded_true:0,refunded_false:0,refunded_unobserved:0}
 ]});
test('Review-author refund flag partial bounds are not paid order rates',()=>{
 const x=audit(make());
 assert.equal(x.checked_review_flag_fraction_lower,1/3);
 assert.equal(x.checked_review_flag_fraction_upper,2/3);
 assert.equal(x.complete_review_query_candidate,true);
 for(const name of ['actual_refunded_paid_orders','actual_paid_order_refund_rate',
  'matched_original_purchase_cohort_refund_rate','publisher_refund_loss_usd',
  'developer_net_profit','actual_steam_review_author_flag_fraction'])
  assert.equal(x[name],null);
 assert.equal(x.individual_review_records_processed,false);
});
test('Even all known review flags never verify refunded orders',()=>{
 const x=make();x.flag_pages[1].refunded_false=1;x.flag_pages[1].refunded_unobserved=0;
 const r=audit(x);assert.equal(r.synthetic_complete_review_flag_fraction,1/3);
 assert.equal(r.actual_paid_order_refund_rate,null);
});
test('Narrow filters remain separate from all-source review scope',()=>{
 for(const change of [{languages:['english']},{purchase_type:0},{review_type:1},
  {filter_offtopic_activity:true}]){
  const x=make();Object.assign(x.query.request,change);
  assert.equal(audit(x).complete_review_query_candidate,false);
  assert.equal(audit(x).synthetic_complete_review_flag_fraction,null);
 }
});
test('No reviews means an undefined review fraction, not zero refunded orders',()=>{
 const x=make();x.query.pages=[{http_status:200,response_envelope:'response',cursor_in:'*',
  cursor_out:null,num_reviews:0,returned_reviews_length:0,total_matching:0}];
 x.flag_pages=[{cursor_in:'*',refunded_true:0,refunded_false:0,refunded_unobserved:0}];
 const r=audit(x);assert.equal(r.checked_review_flag_fraction_lower,null);
 assert.equal(r.synthetic_complete_review_flag_fraction,null);
 assert.equal(r.actual_paid_order_refund_rate,null);
});
test('Misaligned, private or overflowing aggregate input fails closed',()=>{
 for(const bad of [
  x=>{x.flag_pages[0].refunded_true=2;},
  x=>{x.flag_pages[0].steamid='private';},
  x=>{x.flag_pages[0].refunded_false=-1;},
  x=>{x.flag_pages[0].refunded_true=4294967296;},
  x=>{x.flag_pages[1].cursor_in='fixture-wrong';},
  x=>{x.flag_pages.pop();},
  x=>{x.query.request.appid=100;},
  x=>{x.query.pages[2].http_status=429;},
  x=>{x.query.fixture_id='fixture-mismatch';}
 ]){
  const x=make();bad(x);assert.throws(()=>audit(x));
 }
});
test('Preexisting official source is present, without inventing buyers or new tasks',()=>{
 const d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
 assert.equal(study.source_ids.length,1);
 assert(d.evidence.some(s=>s.id===study.source_ids[0]));
 assert(Object.values(study.unknown).every(x=>x===null));
 const tasks=[...p.detail_tasks,...q.queues.flatMap(x=>x.tasks)];
 assert.equal(tasks.length,293);
 assert.equal(new Set(tasks.map(x=>x.id)).size,293);
});

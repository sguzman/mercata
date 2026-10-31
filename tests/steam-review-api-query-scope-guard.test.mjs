import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {migrateSyntheticSteamLegacyReviewQuery as migrate,
 auditSyntheticSteamReviewQueryCoverage as audit} from '../site/steam-review-api-query-scope-guard.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=read('ontology/steam/steam-review-api-query-scope-migration-2026.json'),d=read('specimens/steam.json'),
 p=read('plans/steam.json'),q=read('queues/steam.json');
const query=()=>({fixture_id:'fixture-reviews',
 request:{service:'IUserReviewsService/GetAppReviews/v1',filter:1,
  languages:['all'],purchase_type:1,review_type:0,num_per_page:2,
  filter_offtopic_activity:false},
 pages:[
  {http_status:200,response_envelope:'response',cursor_in:'*',cursor_out:'fixture-cursor-a',num_reviews:2,total_matching:3,score_total_reviews:2},
  {http_status:200,response_envelope:'response',cursor_in:'fixture-cursor-a',cursor_out:'fixture-cursor-b',num_reviews:1,total_matching:3},
  {http_status:200,response_envelope:'response',cursor_in:'fixture-cursor-b',cursor_out:'fixture-cursor-c',num_reviews:0,total_matching:3}
 ]});
test('Explicit legacy labels translate to current numeric enums without a network call',()=>{
 const z=migrate({fixture_id:'fixture-a',filter:'recent',language:'all',
  purchase_type:'all',review_type:'all',num_per_page:100,filter_offtopic_activity:false});
 assert.equal(z.normalized_request.filter,1);
 assert.deepEqual(z.normalized_request.languages,['all']);
 assert.equal(z.normalized_request.purchase_type,1);
 assert.equal(z.normalized_request.review_type,0);
 assert.equal(z.legacy_route_reuse_allowed,false);
 assert.equal(z.actual_http_request_performed,false);
 const updated=migrate({fixture_id:'fixture-b',filter:'updated',language:'english',
  purchase_type:'non_steam_purchase',review_type:'negative',num_per_page:1,
  filter_offtopic_activity:true});
 assert.equal(updated.normalized_request.filter,2);
 assert.equal(updated.normalized_request.purchase_type,2);
 assert.equal(updated.normalized_request.review_type,2);
});
test('A count-matched, empty-terminated, unfiltered synthetic query is still not live verified',()=>{
 const r=audit(query());
 assert.equal(r.internal_count_chain_reconciled,true);
 assert.equal(r.synthetic_http_200_envelope_pages,3);
 assert.equal(r.failed_http_pages_admitted,false);
 assert.equal(r.legacy_success_field_admitted,false);
 assert.equal(r.observed_review_rows_in_fixture,3);
 assert.equal(r.reported_total_matching_in_fixture,3);
 assert.equal(r.first_page_score_total_reviews_if_supplied,2);
 assert.equal(r.score_summary_is_per_page_increment,false);
 assert.equal(r.all_origin_all_language_query_chain_candidate,true);
 assert.equal(r.real_steam_review_population_verified,null);
 assert.equal(r.real_steam_purchased_game_units,null);
 assert.equal(r.network_requests_executed,false);
});
test('Default-like English or Steam-origin subset and off-topic exclusions cannot represent all reviews',()=>{
 for(const change of [{languages:['english']},{purchase_type:0},
  {filter_offtopic_activity:true},{review_type:1}]){
  const x=query();x.request={...x.request,...change};
  if(change.review_type===1)delete x.pages[0].score_total_reviews;
  const r=audit(x);
  assert.equal(r.query_is_unfiltered_all_review_sources,false);
  assert.equal(r.all_origin_all_language_query_chain_candidate,false);
  assert.equal(r.zero_paid_order_inference,null);
 }
});
test('Helpful and Funny sort remain nonexhaustive even with internally consistent pages',()=>{
 for(const filter of [0,3]){
  const x=query();x.request.filter=filter;
  const r=audit(x);
  assert.equal(r.helpful_or_funny_sort_not_exhaustive,true);
  assert.equal(r.all_origin_all_language_query_chain_candidate,false);
 }
});
test('Missing terminal empty page cannot be called a finished page chain',()=>{
 const x=query();x.pages.pop();
 const r=audit(x);
 assert.equal(r.terminal_empty_page_seen,false);
 assert.equal(r.internal_count_chain_reconciled,false);
 assert.equal(r.all_origin_all_language_query_chain_candidate,false);
});
test('A terminal empty page rejects mismatched total counts and moving page totals',()=>{
 const a=query();a.pages[1].num_reviews=0;
 assert.throws(()=>audit(a),/Empty review page/);
 const b=query();b.pages[2].total_matching=4;
 assert.throws(()=>audit(b),/total_matching changed/);
 const c=query();c.pages[0].total_matching=4;
 c.pages[1].total_matching=4;c.pages[2].total_matching=4;
 assert.throws(()=>audit(c),/does not reconcile/);
});
test('Duplicate, disconnected and nonadvancing cursors fail closed',()=>{
 const a=query();a.pages[1].cursor_in='fixture-cursor-wrong';
 assert.throws(()=>audit(a),/Malformed synthetic page/);
 const b=query();b.pages[1].cursor_out='fixture-cursor-a';
 assert.throws(()=>audit(b),/Nonempty page must have an advancing/);
 const c=query();c.pages[1].cursor_out='*';
 assert.throws(()=>audit(c),/Malformed synthetic page/);
});
test('HTTP 429 and non-200 or legacy response shapes never count as a terminal empty page',()=>{
 for(const status of [429,500,404,0,null,undefined]){
  const x=query();x.pages[2].http_status=status;
  assert.throws(()=>audit(x),/Malformed synthetic page/);
 }
 const a=query();delete a.pages[0].http_status;
 assert.throws(()=>audit(a),/Malformed synthetic page/);
 const b=query();b.pages[1].response_envelope='legacy_success';
 assert.throws(()=>audit(b),/Malformed synthetic page/);
 const c=query();c.pages[1].success=1;
 assert.throws(()=>audit(c),/Malformed synthetic page/);
 const d=query();delete d.pages[2].response_envelope;
 assert.throws(()=>audit(d),/Malformed synthetic page/);
});
test('Score total is first-page and all-review-type only, never a sum across pages',()=>{
 const a=query();a.pages[1].score_total_reviews=5;
 assert.throws(()=>audit(a),/Malformed synthetic page/);
 const b=query();b.request.review_type=2;
 assert.throws(()=>audit(b),/Malformed synthetic page/);
 const c=query();c.pages[0].score_total_reviews=undefined;
 assert.equal(audit(c).first_page_score_total_reviews_if_supplied,null);
});
test('Synthetic fixtures reject private-looking or obsolete request fields',()=>{
 const a=query();a.request.language='all';
 assert.throws(()=>audit(a),/Bounded explicit/);
 const b=query();b.pages[0].author_steamid='private';
 assert.throws(()=>audit(b),/Malformed synthetic/);
 const c=query();c.request.appid=12345;
 assert.throws(()=>audit(c),/Bounded explicit/);
 const d=query();d.request.num_per_page=101;
 assert.throws(()=>audit(d),/Bounded explicit/);
 const e=query();e.request.languages=['all','english'];
 assert.throws(()=>audit(e),/Bounded explicit/);
 const f=query();f.request.service='store.steampowered.com/appreviews';
 assert.throws(()=>audit(f),/Bounded explicit/);
});
test('Migration refuses implicit legacy filter defaults and new endpoint raw-person input',()=>{
 const f={fixture_id:'fixture-query',filter:'all',language:'english',
  purchase_type:'steam',review_type:'all',num_per_page:20,filter_offtopic_activity:true};
 assert.equal(migrate(f).normalized_request.filter,0);
 for(const k of ['filter','language','purchase_type','review_type','num_per_page','filter_offtopic_activity']){
  const x={...f};delete x[k];assert.throws(()=>migrate(x),/Explicit fictional/);
 }
 assert.throws(()=>migrate({...f,review_text:'secret'}),/Explicit fictional/);
});
test('Official sources, claims and fixed 293 tasks remain attributed',()=>{
 const ids=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(study.source_ids.length,3);
 assert.equal(study.claim_ids.length,4);
 for(const s of study.source_ids)assert(ids.has(s),s);
 for(const id of study.claim_ids){
  const c=claims.get(id);assert(c,id);
  assert(c.source_ids.length>0&&c.source_ids.every(s=>ids.has(s)));
 }
 assert(Object.values(study.unknown).every(x=>x===null));
 assert.equal(study.live_endpoint_called,false);
 const tasks=[...p.detail_tasks,...q.queues.flatMap(g=>g.tasks)];
 assert.equal(tasks.length,293);
 assert.equal(new Set(tasks.map(x=>x.id)).size,293);
 for(const id of ["steam/income/measure-exact-zero-sale-fraction","steam/competition/study-early-review-count-concentration","sales/reputation"]){
  const t=tasks.find(x=>x.id===id);
  assert(t.evidence.includes('ontology/steam/steam-review-api-query-scope-migration-2026.md'));
  assert(t.evidence.includes('ontology/steam/steam-review-api-query-scope-migration-2026.json'));
 }
 const exact=tasks.reduce((sum,t)=>sum+(t.percent??t.progress),0)/293;
 assert.equal(p.progress_percent,Math.round(exact));
});

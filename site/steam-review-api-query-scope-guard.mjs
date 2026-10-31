// Pure fictional Steam review-query migration and pagination audit.
// No Steam review texts, real AppIDs, reviewer identities, raw API payloads or keys.
const shape=(x,fields)=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&
 Object.keys(x).every(k=>fields.includes(k));
const fixture=x=>typeof x==='string'&&/^fixture-[a-z0-9-]+$/.test(x);
// The service reports review counts as uint32, not arbitrary JavaScript integers.
const counts=x=>Number.isSafeInteger(x)&&x>=0&&x<=0xffffffff;
const filter={all:0,recent:1,updated:2};
const purchase={steam:0,all:1,non_steam_purchase:2};
const review={all:0,positive:1,negative:2};
const language=x=>typeof x==='string'&&/^[a-z]{2,32}$/.test(x);
const cursor=x=>typeof x==='string'&&/^fixture-cursor-[a-z0-9-]+$/.test(x);

export function migrateSyntheticSteamLegacyReviewQuery(input={}){
 if(!shape(input,['fixture_id','filter','language','purchase_type','review_type',
  'num_per_page','filter_offtopic_activity'])||!fixture(input.fixture_id)||
  !Object.hasOwn(filter,input.filter)||!language(input.language)||
  !Object.hasOwn(purchase,input.purchase_type)||
  !Object.hasOwn(review,input.review_type)||
  !Number.isSafeInteger(input.num_per_page)||input.num_per_page<1||input.num_per_page>100||
  typeof input.filter_offtopic_activity!=='boolean')
  throw new TypeError('Explicit fictional legacy query filters required: do not silently adopt new defaults');
 return Object.freeze({
  fixture_id:input.fixture_id,
  normalized_request:{
   service:'IUserReviewsService/GetAppReviews/v1',
   filter:filter[input.filter],languages:[input.language],
   purchase_type:purchase[input.purchase_type],review_type:review[input.review_type],
   num_per_page:input.num_per_page,
   filter_offtopic_activity:input.filter_offtopic_activity
  },
  legacy_route_reuse_allowed:false,
  translated_into_input_json_parameters:true,
  actual_http_request_performed:false
 });
}

export function auditSyntheticSteamReviewQueryCoverage(input={}){
 if(!shape(input,['fixture_id','request','pages'])||!fixture(input.fixture_id)||
  !shape(input.request,['service','filter','languages','purchase_type','review_type',
   'num_per_page','filter_offtopic_activity'])||
  input.request.service!=='IUserReviewsService/GetAppReviews/v1'||
  !Number.isInteger(input.request.filter)||input.request.filter<0||input.request.filter>3||
  !Array.isArray(input.request.languages)||!input.request.languages.length||
  input.request.languages.length>12||
  input.request.languages.some(x=>!language(x))||
  new Set(input.request.languages).size!==input.request.languages.length||
  (input.request.languages.includes('all')&&input.request.languages.length!==1)||
  ![0,1,2].includes(input.request.purchase_type)||
  ![0,1,2].includes(input.request.review_type)||
  !Number.isSafeInteger(input.request.num_per_page)||
  input.request.num_per_page<1||input.request.num_per_page>100||
  typeof input.request.filter_offtopic_activity!=='boolean'||
  !Array.isArray(input.pages)||input.pages.length<1||input.pages.length>32)
  throw new TypeError('Bounded explicit fictional GetAppReviews request and summary pages required');

 const pages=input.pages;
 let nextCursor='*',observed=0,matching=null,emptyTerminal=false,firstPageScore=null;
 const visited=new Set();
 for(let i=0;i<pages.length;i++){
  const page=pages[i];
  if(!shape(page,['http_status','response_envelope','cursor_in','cursor_out','num_reviews','returned_reviews_length','total_matching','score_total_reviews'])||
   page.http_status!==200||page.response_envelope!=='response'||
   page.cursor_in!==nextCursor||visited.has(page.cursor_in)||
   !(page.cursor_in==='*'||cursor(page.cursor_in))||
   !(page.cursor_out===null||cursor(page.cursor_out))||
   !counts(page.num_reviews)||page.num_reviews>input.request.num_per_page||
   !counts(page.returned_reviews_length)||page.returned_reviews_length!==page.num_reviews||
   !counts(page.total_matching)||
   page.score_total_reviews!==undefined&&(!counts(page.score_total_reviews)||
    i!==0||input.request.review_type!==0))
   throw new TypeError('Malformed synthetic page, mismatched cursor, unsafe count or invalid score summary');
  visited.add(page.cursor_in);
  if(matching===null)matching=page.total_matching;
  else if(page.total_matching!==matching)
   throw new RangeError('Page total_matching changed during synthetic pagination');
  if(page.num_reviews===0){
   if(i!==pages.length-1)throw new RangeError('Empty review page must terminate fixture');
   emptyTerminal=true;
  }else{
   if(page.cursor_out===null||page.cursor_out===page.cursor_in||
      visited.has(page.cursor_out))
    throw new RangeError('Nonempty page must have an advancing fictional next cursor');
   observed+=page.num_reviews;
   if(!Number.isSafeInteger(observed))throw new RangeError('Unsafe synthetic review count');
  }
  if(i===0)firstPageScore=page.score_total_reviews??null;
  nextCursor=page.cursor_out;
 }
 if(emptyTerminal&&observed!==matching)
  throw new RangeError('Terminal empty-page traversal does not reconcile its declared total_matching');
 const r=input.request;
 const historicalSort=r.filter===1||r.filter===2;
 const fullScope=r.languages.length===1&&r.languages[0]==='all'&&
  r.purchase_type===1&&r.review_type===0&&r.filter_offtopic_activity===false;
 return Object.freeze({
  kind:'synthetic_review_query_scope_audit_not_paid_order_observation',
  fixture_id:input.fixture_id,
  requested_review_language_scope:r.languages.slice(),
  requested_purchase_type:r.purchase_type,
  requested_review_type:r.review_type,
  requested_offtopic_filter:r.filter_offtopic_activity,
  historical_pagination_sort_supported:historicalSort,
  helpful_or_funny_sort_not_exhaustive:!historicalSort,
  query_is_unfiltered_all_review_sources:fullScope,
  pages_supplied:pages.length,
  observed_review_rows_in_fixture:observed,
  reported_total_matching_in_fixture:matching,
  terminal_empty_page_seen:emptyTerminal,
  internal_count_chain_reconciled:emptyTerminal&&observed===matching,
  synthetic_http_200_envelope_pages:pages.length,
  page_summary_counts_match_fictional_array_lengths:true,
  failed_http_pages_admitted:false,
  legacy_success_field_admitted:false,
  all_origin_all_language_query_chain_candidate:fullScope&&historicalSort&&
    emptyTerminal&&observed===matching,
  first_page_score_total_reviews_if_supplied:firstPageScore,
  score_summary_is_per_page_increment:false,
  unique_review_identifiers_deduplicated:false,
  real_steam_review_population_verified:null,
  real_steam_purchased_game_units:null,
  zero_paid_order_inference:null,
  publisher_cash_or_profit:null,
  network_requests_executed:false,
  private_customer_data_ingested:false,
  caveat:'Fictional HTTP-200 and response-envelope assertions reject synthetic rate-limit, server-error and legacy payload shapes, but do not authenticate a real request. Query-summary page counts and invented review-array lengths must agree, but no actual review text or reviewer identities are ingested. Count and cursor consistency in invented pages does not authenticate the Steam API, verify unique reviews, freeze a moving catalog, or identify paid checkouts. Default English/Steam-origin/off-topic filters change the observed query frame; Helpful/Funny ordering cannot be assumed to exhaust all historical reviews. First-page score summary differs from per-page counts and from transaction units.'
 });
}

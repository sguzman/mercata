import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticSteamStorePages as audit} from '../site/steam-store-api-pagination-synthetic-guard.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=read('ontology/steam/official-paginated-current-game-catalog-is-not-historical-census-2026.json'),
 dossier=read('specimens/steam.json'),plan=read('plans/steam.json'),queue=read('queues/steam.json');
const item=(n,last_modified=100,price_change_number=0)=>({fixture_appid:'fixture-app-'+String(n).padStart(6,'0'),last_modified,price_change_number});
const pg=(n,cursor,items,final=false)=>({page_id:'fixture-page-'+n,requested_last_appid:cursor,items,declared_final_page:final});
const f=()=>({fixture_id:'fixture-store',max_results:2,include_games:true,if_modified_since:null,pages:[
 pg('first',null,[item(10),item(20)]),pg('last','fixture-app-000020',[item(30)],true)]});
test('Official service retains page limit, key gate and metadata-not-launch cautions',()=>{
 const x=study.documented_service;
 assert.equal(x.default_max_results,10000);assert.equal(x.max_max_results,50000);
 assert.equal(x.web_api_key_required,true);assert.equal(x.include_games_default,true);
 assert.equal(x.last_modified_is_release_time,false);assert.equal(x.price_change_number_is_paid_sales,false);
});
test('Internally coherent fake 2-page store listing is not a historic paid-game or financial census',()=>{
 const z=audit(f());
 assert.equal(z.supplied_pages,2);assert.equal(z.supplied_distinct_items,3);
 assert.equal(z.declared_terminal_page_seen,true);assert.equal(z.declared_full_current_game_frame,true);
 assert.equal(z.api_call_executed,false);assert.equal(z.credential_used,false);
 for(const k of ['full_historical_first_paid_frame','actual_completed_merchant_paid_orders','zero_paid_sale_app_fraction','verified_publisher_income'])assert.equal(z[k],null);
 assert(Object.values(study.unknown).every(x=>x===null));
});
test('Modified-only pagination is delta, not an unconditional full Store frame',()=>{
 const z=audit({...f(),if_modified_since:1770000000});
 assert.equal(z.declared_terminal_page_seen,true);
 assert.equal(z.modified_only_delta,true);
 assert.equal(z.declared_full_current_game_frame,false);
});
test('Missing final page remains explicitly incomplete',()=>{
 const x=f();x.pages[1].declared_final_page=false;
 const z=audit(x);
 assert.equal(z.declared_terminal_page_seen,false);
 assert.equal(z.declared_full_current_game_frame,false);
});
test('Strict duplicate, cursor, ordering, key and schema failures',()=>{
 const original=f();
 for(const change of [{max_results:50001},{include_games:false},{if_modified_since:-1},{api_key:'secret'}])
   assert.throws(()=>audit({...original,...change}));
 const bad=[
  [pg('first',null,[item(10),item(20)]),pg('last','fixture-app-000010',[item(30)],true)],
  [pg('first',null,[item(10),item(20)]),pg('last','fixture-app-000020',[item(20)],true)],
  [pg('first',null,[item(20),item(10)],true)],
  [pg('first',null,[item(10),item(20),item(30)],true)],
  [pg('first',null,[],false)],
  [pg('first',null,[item(10)],true),pg('last','fixture-app-000010',[item(20)],true)],
  [pg('first',null,[{...item(10),appid:10}],true)]
 ];
 for(const pages of bad)assert.throws(()=>audit({...f(),pages}));
});
test('Official existing sources and original 293 Steam tasks retained',()=>{
 const sources=new Set(dossier.evidence.map(x=>x.id)),claims=new Map(dossier.claims.map(x=>[x.id,x]));
 assert.equal(study.source_ids.length,2);assert.equal(study.claim_ids.length,10);
 for(const id of study.source_ids)assert(sources.has(id),id);
 for(const id of study.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>sources.has(s)));}
 const scores=[...plan.detail_tasks.map(x=>x.percent),...queue.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(scores.length,293);assert.equal(plan.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});

import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSelectedSteamPublicCaseCrosswalk as audit} from '../site/steam-selected-case-identity-window-audit.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const cross=read('ontology/steam/selected-eight-first-paid-sales-window-finance-crosswalk-2026.json'),
 d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
const rows=()=>structuredClone(cross.rows);
test('Eight distinct author-selected positive-sale cases never identify population zeros or cash',()=>{
 const a=audit(rows());assert.equal(a.selected_distinct_positive_report_games,8);
 assert.equal(a.first_person_reports,7);assert.equal(a.second_person_reports,1);
 assert.equal(a.disclosed_zero_sale_intervals,1);assert.equal(a.comparable_fixed_reporting_windows,false);
 assert.equal(a.money_stages_comparable,false);assert.equal(a.valid_inference_of_population_median,false);
 for(const k of ['verified_paid_order_distribution','verified_bank_cash_distribution','actual_zero_paid_sale_fraction','verified_after_cost_profit'])assert.equal(a[k],null);
 assert(Object.values(cross.unobserved).every(v=>v===null));
});
test('Each crosswalk row is traceable to the exact underlying public machine study',()=>{
 for(const r of cross.rows){
  const study=read(r.source_file);assert(study.source_ids.includes(r.source_id),r.game_key);
  assert(study.claim_ids.includes(r.claim_id),r.game_key);
  let appid=null,units=null,date=null;
  if(r.game_key==='go_up'){appid=study.store_listing.app_id;units=study.public_author_report.lifetime_steam_units_reported;date=study.store_listing.first_public_paid_early_access_date;}
  else if(r.game_key==='luckyest'){appid=study.public_store.app_id;units=study.public_author_reports.later.cumulative_units_reported;date=study.public_store.first_paid_release_at;}
  else if(r.game_key==='immunica'){appid=study.store.app_id;units=study.public_author.cumulative_units_later_post;date=study.store.first_paid_release;}
  else if(r.game_key==='hugbetray'){appid=study.release.main_app_id;units=study.public_author.steam_units_reported;date=study.release.store_us_release_calendar_date;}
  else if(r.game_key==='crazy_city_golf'){appid=study.identity.main_paid_game_app_id;units=study.public_report.copies_sold_after_more_than_one_day_reported;date=study.identity.main_paid_release;}
  else {const c=study.cases.find(c=>c.id===r.game_key);assert(c,r.game_key);appid=c.appid;units=c.reported_units;date=c.first_paid_release;}
  assert.equal(r.app_id,appid,r.game_key);assert.equal(r.reported_units,units,r.game_key);assert.equal(r.first_paid_date,date,r.game_key);
 }
});
test('The crosswalk distinguishes unknown money, pre-platform net and a zero-order interval',()=>{
 const index=new Map(cross.rows.map(r=>[r.game_key,r]));
 assert.equal(index.get('vocator').reported_author_net_usd,null);
 assert.equal(index.get('luckyest').net_stage,'before_platform_share');
 assert.equal(index.get('go_up').first_paid_date,'2025-07-11');
 assert.equal(index.get('hugbetray').reported_zero_sales_interval,true);
 assert.equal(index.get('crazy_city_golf').report_type,'second_person');
});
test('Reject duplicates, an apparent zero-selling case, fake verified payouts and malformed money labels',()=>{
 const xs=rows();
 for(const bad of [
  {app_id:xs[1].app_id},{reported_units:0},{verified_merchant_sales:true},
  {verified_legal_partner_cash:true},{verified_developer_profit:true},
  {first_paid_date:'2026-02-30'},{reported_author_net_usd:-1},{source_file:'../private.json'},
  {net_stage:'before_platform_share',reported_author_net_usd:null},{account_number:'private'}
 ]){
  const a=rows();a[0]={...a[0],...bad};assert.throws(()=>audit(a));
 }
 assert.throws(()=>audit([]));
});
test('Crosswalk references current sources, claims and the original 293 Steam tasks',()=>{
 const sids=new Set(d.evidence.map(s=>s.id)),cids=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(cross.source_ids.length,8);assert.equal(cross.claim_ids.length,8);
 for(const id of cross.source_ids)assert(sids.has(id),id);
 for(const id of cross.claim_ids){assert(cids.has(id),id);assert(cids.get(id).source_ids.every(s=>sids.has(s)),id);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);
 assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});


test('Finance labels remain linked to their original public source fields, not all reclassified as gross',()=>{
 const index=new Map(cross.rows.map(r=>[r.game_key,r]));
 const studies={
  go:read('ontology/steam/go-up-earliest-paid-ea-and-contributor-proceeds-2026.json'),
  lucky:read('ontology/steam/luckyest-two-checkpoint-net-stage-correction-2026.json'),
  triple:read('ontology/steam/first-commercial-mismatched-disclosure-windows-2026.json'),
  immune:read('ontology/steam/immunica-firstgame-niche-event-wishlist-and-sales-windows-2026.json'),
  hug:read('ontology/steam/hugbetray-fiveweek-zero-period-keys-bots-and-cash-2026.json')
 };
 assert.equal(index.get('go_up').reported_gross_usd,studies.go.public_author_report.gross_steam_usd_reported);
 assert.equal(index.get('go_up').reported_author_net_usd,studies.go.public_author_report.net_steam_usd_reported_undefined_deduction_basis);
 assert.equal(index.get('luckyest').reported_gross_usd,studies.lucky.public_author_reports.later.gross_usd_approx);
 assert.equal(index.get('luckyest').reported_author_net_usd,studies.lucky.public_author_reports.later.net_usd_author_label);
 assert.equal(index.get('luckyest').net_stage,'before_platform_share');
 assert.equal(index.get('immunica').reported_gross_usd,studies.immune.public_author.reported_gross_usd);
 assert.equal(index.get('immunica').reported_author_net_usd,studies.immune.public_author.reported_net_usd_approx);
 assert.equal(index.get('off_the_beaten_track').reported_author_net_usd,
  studies.triple.cases.find(r=>r.id==='off_the_beaten_track').reported_revenue_usd);
 assert.equal(index.get('lone_survivors').reported_undefined_total_revenue_usd,
  studies.triple.cases.find(r=>r.id==='lone_survivors').reported_revenue_usd);
 assert.equal(index.get('vocator').reported_author_net_usd,null);
 assert.equal(index.get('hugbetray').reported_gross_usd,null);
 assert.equal(index.get('hugbetray').reported_undefined_total_revenue_usd,studies.hug.public_author.author_total_revenue_usd_approx);
 assert.equal(index.get('hugbetray').reported_author_net_usd,studies.hug.public_author.author_net_earnings_usd_approx);
 assert.equal(index.get('crazy_city_golf').reported_gross_usd,null);
 assert.equal(index.get('crazy_city_golf').reported_author_net_usd,null);
 for(const r of cross.rows){assert.equal(r.verified_legal_partner_cash,false);assert.equal(r.verified_developer_profit,false);}
});

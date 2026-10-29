import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticSteamWishlistMonthCohorts as audit} from '../site/steam-wishlist-month-cohort-guards.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/steam-wishlist-month-cohort-pacific-reporting-lag-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Valve DateLocal PT and first-wishlist MonthCohort lead to intervals, not a fake single delay',()=>{
 const r=audit(x.synthetic_fixture);
 assert.equal(r.latest_complete_report_day,'2026-10-28');
 assert.equal(r.total_reported_wishlist_purchase_events,10);
 assert.equal(r.monthly_cohort_is_exact_first_add_day,false);
 const oct=r.rows[0];assert.equal(oct.minimum_calendar_day_lag,0);assert.equal(oct.maximum_calendar_day_lag,27);
 const aug=r.rows[1];assert.equal(aug.minimum_calendar_day_lag,57);assert.equal(aug.maximum_calendar_day_lag,87);
 assert.deepEqual(r.purchase_events_by_original_add_month,[{month_cohort:'2026-08-01',purchase_events:5},{month_cohort:'2026-10-01',purchase_events:5}]);
});
test('One known wishlist-originated sale numerator does not identify all sales, refund net, or conversion',()=>{
 const r=audit(x.synthetic_fixture);
 for(const k of ['matched_wishlist_purchase_probability','all_game_paid_orders','net_after_refunds','actual_steam_wishlist_counts','publisher_cash','causal_notification_effect'])assert.equal(r[k],null);
 assert.equal(r.reported_wishlist_purchases_are_all_paid_orders,false);
 assert.equal(r.platform_preference_subsets_are_whole_population,false);
});
test('Reject current-day data, invalid cohorts, contradictory dates, duplicates and extra fields',()=>{
 const fixture=()=>structuredClone(x.synthetic_fixture);
 const a=fixture();a.rows[0].purchase_date_local_pt=a.as_of_pacific_date;assert.throws(()=>audit(a),/Current day/);
 const b=fixture();b.rows[0].month_cohort='2026-10-15';assert.throws(()=>audit(b),/MonthCohort/);
 const c=fixture();c.rows[0].month_cohort='2026-11-01';assert.throws(()=>audit(c),/MonthCohort/);
 const e=fixture();e.rows[1].purchase_date_local_pt=e.rows[2].purchase_date_local_pt;assert.throws(()=>audit(e),/Repeated/);
 const f=fixture();f.rows[0].steam_id='identity';assert.throws(()=>audit(f),/Synthetic aggregate/);
 const g=fixture();g.rows[0].wishlist_purchase_events=1.5;assert.throws(()=>audit(g),/Safe/);
 const h=fixture();h.rows[0].purchase_date_local_pt='2026-02-30';assert.throws(()=>audit(h),/Invalid/);
});
test('No new game specimen and claims use registered public Valve sources',()=>{
 const ss=new Set(d.evidence.map(s=>s.id)),cc=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,2);assert.equal(x.claim_ids.length,6);
 for(const s of x.source_ids)assert(ss.has(s),s);
 for(const c of x.claim_ids)assert(cc.has(c)&&cc.get(c).source_ids.every(s=>ss.has(s)),c);
 assert(Object.values(x.unknown).every(x=>x===null));
 const v=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(v.length,293);assert.equal(p.progress_percent,Math.round(v.reduce((a,b)=>a+b,0)/293));
});

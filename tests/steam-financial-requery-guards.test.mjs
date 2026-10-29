import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {reconcileSyntheticSteamFinancialDays as reconcile,auditSyntheticSteamChangedDatePolls as auditPolls} from '../site/steam-financial-requery-guards.mjs';
const read=x=>JSON.parse(fs.readFileSync(new URL('../'+x,import.meta.url),'utf8'));
const doc=read('ontology/steam/steam-financial-changed-date-requery-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
const fixture=()=>structuredClone(doc.synthetic_batches);
test('Changed old Pacific Time date replaces the whole day rather than adding prior rows',()=>{
 const r=reconcile(fixture());assert.equal(r.fully_paginated_dates,doc.expected.date_count);
 assert.equal(r.processed_changed_date_batches,doc.expected.processed_batches);
 assert.equal(r.replaced_previous_daily_snapshots,doc.expected.replaced_previous_daily_snapshots);
 for(const [name,value] of Object.entries(doc.expected))if(name in r.totals)assert.equal(r.totals[name],value,name);
 assert.equal(r.days.find(x=>x.financial_date_pt==='2026-05-01').synthetic_rows_after_last_requery,1);
 assert.equal(r.financial_date_time_basis,'Pacific Time');
});
test('Refunds in one day may exceed sold units in that same day',()=>{
 const r=reconcile(fixture());assert.equal(r.totals.steam_package_period_returns,7);
 assert.equal(r.totals.steam_package_gross_units_sold,10);
 assert.equal(r.actual_zero_sale_fraction,null);
 assert.equal(r.full_original_paid_game_cohort_attested,false);
});
test('A refreshed empty day legitimately deletes its older rows and is not a market zero-sale game',()=>{
 const batches=fixture();batches.push({fixture_batch_id:'fixture-day1-cleared',financial_date_pt:'2026-05-01',visibility_scope:'own_partner_only',pages:[{requested_highwatermark_id:0,returned_max_id:0,rows:[]}]});
 const r=reconcile(batches);assert.equal(r.days.find(x=>x.financial_date_pt==='2026-05-01').synthetic_rows_after_last_requery,0);
 assert.equal(r.totals.steam_package_gross_units_sold,2);assert.equal(r.actual_paid_appid_units,null);
});
test('No partial pages, skipped cursors or premature terminal response may claim completed date',()=>{
 const a=fixture();a[0].pages.pop();assert.throws(()=>reconcile(a),/Incomplete/);
 const b=fixture();b[0].pages[1].requested_highwatermark_id=2;assert.throws(()=>reconcile(b),/pagination/);
 const c=fixture();c[0].pages[1].rows=[{fixture_row_id:'fixture-foo',kind:'steam_package',gross_units_sold:1,gross_units_returned:0,gross_units_activated:0}];assert.throws(()=>reconcile(c),/Terminal/);
});
test('A missing or duplicate fixture row, key-as-sale, and private-looking field are rejected',()=>{
 const a=fixture();a[0].pages[0].rows[1].fixture_row_id='fixture-store-a';assert.throws(()=>reconcile(a),/Duplicate/);
 const b=fixture();b[0].pages[0].rows[1].gross_units_sold=7;assert.throws(()=>reconcile(b),/Retail activation/);
 const c=fixture();c[0].pages[0].rows[0].customer_id='personal';assert.throws(()=>reconcile(c),/nonfixture|unsupported/);
 const e=fixture();e[0].fixture_batch_id='real-report';assert.throws(()=>reconcile(e),/synthetic/);
 const f=fixture();f[1].visibility_scope='includes_view_grants';assert.throws(()=>reconcile(f),/visibility/);
});
test('Safe individual unit counts must not overflow aggregate arithmetic',()=>{
 const sales=fixture();
 sales[2].pages[0].rows[0].gross_units_sold=Number.MAX_SAFE_INTEGER;
 assert.throws(()=>reconcile(sales),/Unsafe accumulated units: steam sales/);
 const refunds=fixture();
 refunds[2].pages[0].rows[0].gross_units_returned=Number.MAX_SAFE_INTEGER;
 assert.throws(()=>reconcile(refunds),/Unsafe accumulated units: steam returns/);
 const keys=fixture();
 const first=structuredClone(keys[0].pages[0].rows[1]);
 first.fixture_row_id='fixture-final-key-big';first.gross_units_activated=Number.MAX_SAFE_INTEGER;
 const extra=structuredClone(first);
 extra.fixture_row_id='fixture-other-key';extra.gross_units_activated=1;
 keys[2].pages[0].rows.push(first,extra);
 assert.throws(()=>reconcile(keys),/Unsafe accumulated units: retail keys/);
});
test('Original 293 Steam tasks, public evidence and source/claim join remain intact',()=>{
 const sources=new Set(d.evidence.map(s=>s.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(doc.source_ids.length,3);assert.equal(doc.claim_ids.length,7);
 for(const s of doc.source_ids)assert(sources.has(s),s);
 for(const c of doc.claim_ids){assert(claims.has(c),c);assert(claims.get(c).source_ids.every(s=>sources.has(s)),c);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
 assert(Object.values(doc.unknown).every(x=>x===null));
});

test('Outer changed-date highwatermark is distinct from each daily pagination cursor',()=>{
 const x=auditPolls(doc.synthetic_changed_date_polls);
 assert.equal(x.number_of_polls,3);
 assert.equal(x.unique_changed_dates,2);
 assert.equal(x.total_changed_date_notifications,3);
 assert.equal(x.repeated_date_notifications,1);
 assert.equal(x.final_changed_date_highwatermark,120);
 assert.equal(x.outer_changed_date_marker_interchangeable_with_per_day_page_cursor,false);
 const counts=x.days_to_fully_requery.map(day=>[day,doc.synthetic_batches.filter(batch=>batch.financial_date_pt===day).length]);
 assert.deepEqual(counts,[['2026-05-01',2],['2026-05-02',1]]);
});
test('Outer changed-date poll rejects stale markers and duplicates, while allowing empty unchanged polls',()=>{
 const good=structuredClone(doc.synthetic_changed_date_polls);
 const x=auditPolls(good);assert.equal(x.final_changed_date_highwatermark,120);
 const stale=structuredClone(good);stale[1].input_highwatermark=0;assert.throws(()=>auditPolls(stale),/chain/);
 const backwards=structuredClone(good);backwards[1].result_highwatermark=99;assert.throws(()=>auditPolls(backwards),/chain/);
 const phantom=structuredClone(good);phantom[2].changed_dates_pt=['2026-05-03'];assert.throws(()=>auditPolls(phantom),/Unchanged/);
 const dupe=structuredClone(good);dupe[1].changed_dates_pt.push('2026-05-01');assert.throws(()=>auditPolls(dupe),/Unique/);
 const real=structuredClone(good);real[0].fixture_poll_id='actual-merchant';assert.throws(()=>auditPolls(real),/synthetic/);
});

import {auditSyntheticSteamFinancialRefreshLog as auditRefreshLog} from '../site/steam-financial-requery-guards.mjs';
const refreshFixture=()=>({
 polls:structuredClone(doc.synthetic_changed_date_polls),
 batches:structuredClone(doc.synthetic_batches),
 events:structuredClone(doc.synthetic_refresh_events)
});
test('A repeated change date requires a fresh fully paginated batch before its poll checkpoint',()=>{
 const result=auditRefreshLog(refreshFixture());
 assert.equal(result.polls_committed,3);
 assert.equal(result.changed_date_notifications,3);
 assert.equal(result.fully_refreshed_notifications,3);
 assert.equal(result.final_committed_outer_highwatermark,120);
 assert.deepEqual(result.checkpoints.map(x=>x.refreshed_dates),[1,2,0]);
 assert.equal(result.reconciled.replaced_previous_daily_snapshots,1);
 assert.equal(result.reconciled.totals.steam_package_gross_units_sold,10);
 assert.equal(result.reconciled.totals.retail_key_units_activated,0);
 assert.equal(result.actual_checkpoint_write_durability,null);
 assert.equal(result.actual_paid_game_zero_fraction,null);
});
test('Unordered batch-array storage cannot reverse the event-log correction chronology',()=>{
 const fixture=refreshFixture();
 fixture.batches.reverse();
 const result=auditRefreshLog(fixture);
 assert.equal(result.reconciled.totals.steam_package_period_net_units,3);
 assert.equal(result.reconciled.days.find(x=>x.financial_date_pt==='2026-05-01').revised_within_input,true);
});
test('Checkpoint before all notified dates or before a poll is complete is rejected',()=>{
 const a=refreshFixture();
 a.events=a.events.filter(e=>!(e.kind==='refresh'&&e.fixture_batch_id==='fixture-may2'));
 assert.throws(()=>auditRefreshLog(a),/Cannot checkpoint before/);
 const b=refreshFixture();[b.events[4],b.events[6]]=[b.events[6],b.events[4]];
 assert.throws(()=>auditRefreshLog(b),/Cannot checkpoint before/);
 const c=refreshFixture();c.events.splice(2,1);
 assert.throws(()=>auditRefreshLog(c),/committed checkpoint order|Every poll must/);
});
test('No unnotified date, reused batch or orphan batch can be treated as a reconciled refresh',()=>{
 const a=refreshFixture();a.events[1].fixture_batch_id='fixture-may2';
 assert.throws(()=>auditRefreshLog(a),/not notified/);
 const b=refreshFixture();b.events[5].fixture_batch_id='fixture-initial-may1';
 assert.throws(()=>auditRefreshLog(b),/unused/);
 const c=refreshFixture();const extra=structuredClone(c.batches[1]);
 extra.fixture_batch_id='fixture-unlinked';
 c.batches.push(extra);
 assert.throws(()=>auditRefreshLog(c),/Unlinked/);
});
test('Wrong stored marker, incomplete pages, event order and data-bearing event fields fail closed',()=>{
 const a=refreshFixture();a.events[6].stored_highwatermark=999;
 assert.throws(()=>auditRefreshLog(a),/Checkpoint must store/);
 const b=refreshFixture();b.batches[2].pages.pop();
 assert.throws(()=>auditRefreshLog(b),/Incomplete|Missing terminal/);
 const c=refreshFixture();c.events[4].private_partner_id='not-a-fixture';
 assert.throws(()=>auditRefreshLog(c),/Invalid or nonfixture/);
 const e=refreshFixture();e.events[0].fixture_poll_id='fixture-poll-next';
 assert.throws(()=>auditRefreshLog(e),/checkpoint order/);
});
test('A synthetic no-change first poll can checkpoint without falsely asserting zero sales',()=>{
 const r=auditRefreshLog({
  polls:[{fixture_poll_id:'fixture-poll-empty',input_highwatermark:0,result_highwatermark:0,changed_dates_pt:[]}],
  batches:[],events:[
   {kind:'poll',fixture_poll_id:'fixture-poll-empty'},
   {kind:'checkpoint',fixture_poll_id:'fixture-poll-empty',stored_highwatermark:0}
  ]
 });
 assert.equal(r.fully_refreshed_notifications,0);
 assert.equal(r.reconciled,null);
 assert.equal(r.actual_partner_coverage,null);
});
test('An empty page cannot advance its record cursor and manufacture a zero-sales date',()=>{
 const batches=fixture();
 const latest=structuredClone(batches[1]);
 latest.pages[0].rows=[];
 assert.throws(()=>reconcile([latest]),/Advancing per-date page cursor requires/);
 const unchanged=structuredClone(batches[1]);
 unchanged.pages=[{requested_highwatermark_id:0,returned_max_id:0,rows:[]}];
 assert.equal(reconcile([unchanged]).days[0].synthetic_rows_after_last_requery,0);
});

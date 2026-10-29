import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {reconcileSyntheticSteamFinancialDays as reconcile} from '../site/steam-financial-requery-guards.mjs';
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
test('Original 293 Steam tasks, public evidence and source/claim join remain intact',()=>{
 const sources=new Set(d.evidence.map(s=>s.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(doc.source_ids.length,3);assert.equal(doc.claim_ids.length,7);
 for(const s of doc.source_ids)assert(sources.has(s),s);
 for(const c of doc.claim_ids){assert(claims.has(c),c);assert(claims.get(c).source_ids.every(s=>sources.has(s)),c);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
 assert(Object.values(doc.unknown).every(x=>x===null));
});

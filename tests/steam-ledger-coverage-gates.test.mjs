import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditLedgerCoverage,auditSyntheticFixedHorizonZeroSales} from '../site/steam-ledger-coverage.mjs';
const j=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const r=j('ontology/steam/permissioned-ledger-coverage-and-zero-identification-2026.json'),d=j('specimens/steam.json'),p=j('plans/steam.json'),q=j('queues/steam.json');
const rows=[
 {appid:101,eligibility:'eligible_paid_initially',ledger_status:'complete_reconciled',gross_paid_units:0,transfer_history_reconciled:true,authorized_ledger_attested:true,retired:true},
 {appid:102,eligibility:'eligible_paid_initially',ledger_status:'complete_reconciled',gross_paid_units:10,transfer_history_reconciled:true,authorized_ledger_attested:true},
 {appid:103,eligibility:'eligible_paid_initially',ledger_status:'partial',gross_paid_units:0},
 {appid:104,eligibility:'eligible_paid_initially',ledger_status:'missing',gross_paid_units:null},
 {appid:105,eligibility:'eligible_paid_initially',ledger_status:'partial',gross_paid_units:3}
];
test('Synthetic frame has conditional 1/5–3/5 zero-unit bounds, no actual Steam figures',()=>{
 const x=auditLedgerCoverage(rows,{frameComplete:true});
 assert.equal(x.counts.observed_gross_zero,1);
 assert.equal(x.counts.known_gross_nonzero,2);
 assert.equal(x.counts.unknown_zero,2);
 assert.equal(x.counts.retired_eligible,1);
 assert.equal(x.zero_gross_unit_share_lower_conditional,0.2);
 assert.equal(x.zero_gross_unit_share_upper_conditional,0.6);
 assert.equal(x.exact_zero_gross_unit_share,null);
 assert.equal(x.publisher_net_income_median,null);
});
test('Partial positive proves some sales but partial zero never proves zero',()=>{
 const x=auditLedgerCoverage([rows[2],rows[4]],{frameComplete:true});
 assert.equal(x.counts.known_gross_nonzero,1);assert.equal(x.counts.unknown_zero,1);
 assert.equal(x.zero_gross_unit_share_lower_conditional,0);
 assert.equal(x.zero_gross_unit_share_upper_conditional,0.5);
});
test('Incomplete eligible frame or unknown eligibility makes population fractions unreportable',()=>{
 assert.equal(auditLedgerCoverage(rows,{frameComplete:false}).zero_gross_unit_share_upper_conditional,null);
 const more=[...rows,{appid:106,eligibility:'unresolved'}];
 assert.equal(auditLedgerCoverage(more,{frameComplete:true}).zero_gross_unit_share_lower_conditional,null);
});
test('Missing records and incomplete transfer histories cannot claim confirmed zero',()=>{
 assert.throws(()=>auditLedgerCoverage([ {...rows[3],gross_paid_units:0}]),/Missing ledger/);
 assert.throws(()=>auditLedgerCoverage([{...rows[0],transfer_history_reconciled:false}]),/Complete ledgers/);
 assert.throws(()=>auditLedgerCoverage([rows[0],rows[0]]),/duplicate/);
});
test('Claims grounded and no genuine confidential financial records present',()=>{
 const s=new Set(d.evidence.map(x=>x.id)),c=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(r.source_ids.length,4);assert.equal(r.claim_ids.length,12);
 for(const id of r.source_ids)assert(s.has(id));
 for(const id of r.claim_ids){assert(c.has(id));assert(c.get(id).source_ids.every(sid=>s.has(sid)));}
 assert.equal(r.sample_state.real_authorized_ledger_reports,0);
 const scores=[...p.detail_tasks.map(x=>x.percent),...q.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});


const window30={start:'2026-01-01',endExclusive:'2026-11-01',asOfDate:'2026-10-29',horizonDays:30,frameComplete:true};
const fixed=()=>[
 {fixture_game_id:'fixture-a',eligibility:'eligible_paid_initially',first_paid_playable_date:'2026-01-01',
 ledger_status:'complete_reconciled',observed_gross_paid_units:0,covered_from_day:'2026-01-01',
 covered_until_day_exclusive:'2026-01-31',authorized_ledger_attested:true,transfer_history_reconciled:true,
 paid_checkout_attribution_attested:true,retired:true},
 {fixture_game_id:'fixture-b',eligibility:'eligible_paid_initially',first_paid_playable_date:'2026-01-02',
 ledger_status:'partial',observed_gross_paid_units:3,covered_from_day:'2026-01-02',covered_until_day_exclusive:'2026-01-10',
 paid_checkout_attribution_attested:true},
 {fixture_game_id:'fixture-c',eligibility:'eligible_paid_initially',first_paid_playable_date:'2026-01-03',
 ledger_status:'partial',observed_gross_paid_units:0,covered_from_day:'2026-01-03',covered_until_day_exclusive:'2026-01-05'},
 {fixture_game_id:'fixture-d',eligibility:'eligible_paid_initially',first_paid_playable_date:'2026-01-04',
 ledger_status:'missing',observed_gross_paid_units:null},
 {fixture_game_id:'fixture-e',eligibility:'eligible_paid_initially',first_paid_playable_date:'2026-10-20',
 ledger_status:'partial',observed_gross_paid_units:0,covered_from_day:'2026-10-20',covered_until_day_exclusive:'2026-10-26'}
];
test('Synthetic fixed 30-day zero-sales interval retains right-censored unknowns',()=>{
 const x=auditSyntheticFixedHorizonZeroSales(fixed(),window30);
 assert.deepEqual(x.counts,{eligible:5,excluded:0,unresolved_eligibility:0,matured_eligible:4,
 right_censored_eligible:1,confirmed_zero:1,known_nonzero:1,unknown_zero:3});
 assert.equal(x.conditional_zero_share_lower,.2);assert.equal(x.conditional_zero_share_upper,.8);
 assert.equal(x.actual_steam_zero_paid_order_share,null);
 assert.equal(x.entries.find(v=>v.fixture_game_id==='fixture-e').matured,false);
});
test('Unknown paid eligibility or incomplete roster blocks a population fraction',()=>{
 assert.equal(auditSyntheticFixedHorizonZeroSales(fixed(),{...window30,frameComplete:false}).conditional_zero_share_lower,null);
 const x=auditSyntheticFixedHorizonZeroSales([...fixed(),{fixture_game_id:'fixture-unknown',eligibility:'unresolved',first_paid_playable_date:null}],window30);
 assert.equal(x.counts.unresolved_eligibility,1);assert.equal(x.conditional_zero_share_upper,null);
});
test('A complete zero cannot have missing transfer rights, shortened dates or premature horizon',()=>{
 const a=fixed();a[0].transfer_history_reconciled=false;
 assert.throws(()=>auditSyntheticFixedHorizonZeroSales(a,window30),/Complete ledger/);
 const b=fixed();b[0].covered_until_day_exclusive='2026-01-30';
 assert.throws(()=>auditSyntheticFixedHorizonZeroSales(b,window30),/Complete ledger/);
 const c=fixed();c[4].ledger_status='complete_reconciled';
 c[4].covered_until_day_exclusive='2026-11-19';
 c[4].transfer_history_reconciled=true;c[4].authorized_ledger_attested=true;
 assert.throws(()=>auditSyntheticFixedHorizonZeroSales(c,window30),/Complete ledger/);
});
test('Partial positives outside paid release window or elapsed time are rejected',()=>{
 const a=fixed();a[1].covered_from_day='2026-01-01';
 assert.throws(()=>auditSyntheticFixedHorizonZeroSales(a,window30),/Partial report/);
 const b=fixed();b[1].covered_until_day_exclusive='2026-02-02';
 assert.throws(()=>auditSyntheticFixedHorizonZeroSales(b,window30),/Partial report/);
 const c=fixed();c[4].covered_until_day_exclusive='2026-11-01';
 assert.throws(()=>auditSyntheticFixedHorizonZeroSales(c,window30),/Partial report/);
});
test('Missing ledgers, nonfixture IDs and hidden account fields cannot forge zeros',()=>{
 const a=fixed();a[3].observed_gross_paid_units=0;
 assert.throws(()=>auditSyntheticFixedHorizonZeroSales(a,window30),/Missing ledger/);
 const b=fixed();b[0].fixture_game_id='real-id';
 assert.throws(()=>auditSyntheticFixedHorizonZeroSales(b,window30),/Unique synthetic/);
 const c=fixed();c[0].partner_id='private';assert.throws(()=>auditSyntheticFixedHorizonZeroSales(c,window30),/permitted fields/);
 const d=fixed();d.push({...d[0]});assert.throws(()=>auditSyntheticFixedHorizonZeroSales(d,window30),/Unique synthetic/);
});
test('Leap year 365 calendar-day horizon ends on February 28',()=>{
 const a=[{fixture_game_id:'fixture-leap',eligibility:'eligible_paid_initially',first_paid_playable_date:'2024-02-29',
 ledger_status:'complete_reconciled',observed_gross_paid_units:0,covered_from_day:'2024-02-29',
 covered_until_day_exclusive:'2025-02-28',authorized_ledger_attested:true,transfer_history_reconciled:true,
 paid_checkout_attribution_attested:true}];
 const x=auditSyntheticFixedHorizonZeroSales(a,{start:'2024-01-01',endExclusive:'2025-01-01',asOfDate:'2025-03-01',horizonDays:365,frameComplete:true});
 assert.equal(x.entries[0].horizon_end_exclusive,'2025-02-28');
 assert.equal(x.conditional_zero_share_lower,1);assert.equal(x.actual_publisher_income_median,null);
});

test('Package-to-base-game proof is mandatory before admitting a complete zero or partial positive',()=>{
 const a=fixed();delete a[0].paid_checkout_attribution_attested;
 assert.throws(()=>auditSyntheticFixedHorizonZeroSales(a,window30),/Complete ledger/);
 const b=fixed();delete b[1].paid_checkout_attribution_attested;
 assert.throws(()=>auditSyntheticFixedHorizonZeroSales(b,window30),/package-to-game attribution/);
 const c=fixed();c[1].paid_checkout_attribution_attested=false;
 assert.throws(()=>auditSyntheticFixedHorizonZeroSales(c,window30),/package-to-game attribution/);
 const x=auditSyntheticFixedHorizonZeroSales(fixed(),window30);
 assert.equal(x.primary_appid_by_itself_proves_paid_game_units,false);
 assert.equal(x.conditional_zero_share_upper,.8);
});

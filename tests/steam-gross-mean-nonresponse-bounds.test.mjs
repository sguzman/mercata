import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {boundSyntheticSteamGrossMean as bound,conservativeSteamFourDecimalUsdCents as quantize} from '../site/steam-gross-mean-nonresponse-bounds.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/steam-fixed-horizon-gross-mean-nonresponse-bounds-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
const o=(id,amount,h=30)=>({fixture_id:'fixture-'+id,horizon_days:h,gross_usd_cents:amount,
 coverage:'complete_reconciled',financial_access_attested:true,transfer_history_reconciled:true,
 paid_checkout_attribution_attested:true,release_horizon_reconciled:true});
const m=(id,cap=null,verified=false,h=30)=>({fixture_id:'fixture-'+id,horizon_days:h,verified_upper_cap_usd_cents:cap,cap_verified:verified});
const partial=(id,floor,cap=null,verified=false,h=30)=>({...m(id,cap,verified,h),
 observed_partial_gross_usd_cents:floor,partial_gross_verified:true,
 partial_horizon_attested:true,paid_checkout_attribution_attested:true,financial_access_attested:true});
test('A synthetic complete five-game population point-identifies its gross mean',()=>{
 const a=bound({eligibleFrameSize:5,horizonDays:30,cohortFrameVerified:true,observed:[o('a',0),o('b',1000),o('c',2000),o('d',5000),o('e',10000)]});
 assert.equal(a.lower_mean_gross_usd_cents,3600);assert.equal(a.upper_mean_gross_usd_cents,3600);assert.equal(a.point_identified,true);assert.equal(a.publisher_profit_mean,null);
});
test('Two missing gross outcomes leave an unbounded upper despite positive observations',()=>{
 const a=bound({eligibleFrameSize:5,horizonDays:30,cohortFrameVerified:true,observed:[o('a',1000),o('b',2000),o('c',3000)],missing:[m('d'),m('e')]});
 assert.equal(a.lower_mean_gross_usd_cents,1200);assert.equal(a.upper_mean_gross_usd_cents,null);assert.equal(a.upper_unbounded,true);assert.equal(a.unknown_upper_caps,2);
});
test('Independently verified upper caps produce conditional finite bounds',()=>{
 const a=bound({eligibleFrameSize:5,horizonDays:90,cohortFrameVerified:true,observed:[o('a',1000,90),o('b',2000,90),o('c',3000,90)],missing:[m('d',5000,true,90),m('e',7000,true,90)]});
 assert.equal(a.lower_mean_gross_usd_cents,1200);assert.equal(a.upper_mean_gross_usd_cents,3600);assert.equal(a.point_identified,false);assert.equal(a.actual_platform_mean_gross,null);
});
test('Incomplete frames and unsafe imputations fail closed',()=>{
 const args={eligibleFrameSize:2,horizonDays:365,observed:[o('a',200,365)],missing:[m('b',null,false,365)]};
 assert.equal(bound(args).lower_mean_gross_usd_cents,null);assert.equal(bound(args).upper_mean_gross_usd_cents,null);
 assert.throws(()=>bound({...args,cohortFrameVerified:true,missing:[m('b',500,false,365)]}),/verification/);
 assert.throws(()=>bound({...args,observed:[{...o('a',200,365),coverage:'partial'}]}),/Partial/);
 assert.throws(()=>bound({...args,missing:[m('b',null,false,30)]}),/Mixed/);
 assert.throws(()=>bound({...args,missing:[m('a',null,false,365)]}),/Unique/);
 assert.throws(()=>bound({...args,observed:[o('a',-1,365)]}),/Nonnegative/);
 assert.throws(()=>bound({...args,eligibleFrameSize:3}),/reconcile/);
});
test('Public-source claims preserve 293 Steam tasks and real economy remains unmeasured',()=>{
 const s=new Set(d.evidence.map(v=>v.id)),claims=new Map(d.claims.map(v=>[v.id,v]));
 assert.equal(x.source_ids.length,3);assert.equal(x.claim_ids.length,10);
 for(const id of x.source_ids)assert(s.has(id),id);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(z=>s.has(z)),id);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
 assert(p.detail_tasks.find(t=>t.id==='steam/income/estimate-fixed-horizon-mean-gross-revenue').evidence.includes('ontology/steam/steam-fixed-horizon-gross-mean-nonresponse-bounds-2026.json'));
 assert(Object.values(x.unknown).every(v=>v===null));
});

test('Authenticated incomplete gross evidence tightens lower mean without inventing zeros',()=>{
 const args={eligibleFrameSize:5,horizonDays:90,cohortFrameVerified:true,
 observed:[o('a',1000,90),o('b',2000,90),o('c',3000,90)],
 missing:[partial('d',400,5000,true,90),m('e',7000,true,90)]};
 const r=bound(args);
 assert.equal(r.complete_observed_gross_usd_cents,6000);
 assert.equal(r.authenticated_partial_lower_total_usd_cents,400);
 assert.equal(r.lower_mean_gross_usd_cents,1280);
 assert.equal(r.upper_mean_gross_usd_cents,3600);
 assert.equal(r.point_identified,false);
 assert.equal(r.observed_partial_floor_games,1);
 assert.equal(r.actual_platform_mean_gross,null);
});
test('No external upper cap leaves upper mean unbounded despite partial positive gross',()=>{
 const r=bound({eligibleFrameSize:2,horizonDays:30,cohortFrameVerified:true,
 observed:[o('a',2000)],missing:[partial('b',1400)]});
 assert.equal(r.lower_mean_gross_usd_cents,1700);
 assert.equal(r.upper_unbounded,true);
 assert.equal(r.upper_mean_gross_usd_cents,null);
});
test('Equal independently attested floor and cap point-identify hypothetical mean',()=>{
 const r=bound({eligibleFrameSize:2,horizonDays:30,cohortFrameVerified:true,
 observed:[o('a',2000)],missing:[partial('b',1400,1400,true)]});
 assert.equal(r.lower_mean_gross_usd_cents,1700);
 assert.equal(r.upper_mean_gross_usd_cents,1700);
 assert.equal(r.point_identified,true);
 assert.equal(r.actual_platform_mean_gross,null);
});
test('Unverified partial gross, misaligned horizon and implausible upper caps fail closed',()=>{
 const base={eligibleFrameSize:2,horizonDays:30,cohortFrameVerified:true,observed:[o('a',2000)]};
 assert.throws(()=>bound({...base,missing:[{...partial('b',400),partial_gross_verified:false}]}),/Partial floor requires/);
 assert.throws(()=>bound({...base,missing:[{...partial('b',400),partial_horizon_attested:false}]}),/Partial floor requires/);
 assert.throws(()=>bound({...base,missing:[{...partial('b',400),paid_checkout_attribution_attested:false}]}),/Partial floor requires/);
 assert.throws(()=>bound({...base,missing:[{...partial('b',400),financial_access_attested:false}]}),/Partial floor requires/);
 const unauthorized=partial('b',400);delete unauthorized.financial_access_attested;
 assert.throws(()=>bound({...base,missing:[unauthorized]}),/Partial floor requires/);
 assert.throws(()=>bound({...base,missing:[{...m('b'),financial_access_attested:true}]}),/Partial attestation without/);
 assert.throws(()=>bound({...base,missing:[partial('b',400,399,true)]}),/below authenticated partial/);
 assert.throws(()=>bound({...base,missing:[{...m('b'),partial_gross_verified:true}]}),/Partial attestation without/);
 assert.throws(()=>bound({...base,missing:[{...partial('b',-1)}]}),/Nonnegative/);
 assert.throws(()=>bound({...base,missing:[{...m('b'),secret_merchant_id:'not-a-fixture'}]}),/permitted synthetic/);
 assert.throws(()=>bound({...base,missing:[partial('b',400,null,false,90)]}),/Mixed horizons/);
});
test('Partial floors and known complete grosses cannot exceed safe arithmetic',()=>{
 const big=o('a',Number.MAX_SAFE_INTEGER);
 assert.throws(()=>bound({eligibleFrameSize:2,horizonDays:30,cohortFrameVerified:true,
 observed:[big],missing:[partial('b',1)]}),/Unsafe known and partial lower/);
 assert.throws(()=>bound({eligibleFrameSize:2,horizonDays:30,cohortFrameVerified:true,
 observed:[big],missing:[m('b',1,true)]}),/Unsafe known and capped upper/);
});

test('Exact four-decimal gross sales strings yield outward-rounded integer cents',()=>{
 assert.deepEqual(quantize('0.0000'),{lower_cents:0,upper_cents:0,exactly_whole_cents:true});
 assert.deepEqual(quantize('0.0001'),{lower_cents:0,upper_cents:1,exactly_whole_cents:false});
 assert.deepEqual(quantize('12.3456'),{lower_cents:1234,upper_cents:1235,exactly_whole_cents:false});
 assert.deepEqual(quantize('12.3400'),{lower_cents:1234,upper_cents:1234,exactly_whole_cents:true});
 assert.deepEqual(quantize('90071992547409.9100'),{lower_cents:Number.MAX_SAFE_INTEGER,
  upper_cents:Number.MAX_SAFE_INTEGER,exactly_whole_cents:true});
});
test('Four-decimal converter rejects rounding hazards, unsafe magnitudes and noncanonical formats',()=>{
 for(const x of ['12.34','12.34000','01.2300','-1.0000','1e2',' 1.0000',
  '1.0000 ','NaN','Infinity','1,000.0000','100000000000000.0000',12.34,null]){
  assert.throws(()=>quantize(x),/four-decimal/);
 }
 assert.throws(()=>quantize('90071992547409.9101'),/safe integer range/);
});
test('Outward decimal rounding preserves partial gross floor below a finite cap',()=>{
 const floor=quantize('4.0001').lower_cents;
 const cap=quantize('49.9999').upper_cents;
 const r=bound({eligibleFrameSize:2,horizonDays:30,cohortFrameVerified:true,
 observed:[o('a',1000)],missing:[partial('b',floor,cap,true)]});
 assert.equal(floor,400);assert.equal(cap,5000);
 assert.equal(r.lower_mean_gross_usd_cents,700);
 assert.equal(r.upper_mean_gross_usd_cents,3000);
 assert.equal(r.actual_platform_mean_gross,null);
});

test('No complete gross figure is admitted without full financial and game attribution attestations',()=>{
 const base=o('a',1000);
 for(const field of ['financial_access_attested','transfer_history_reconciled',
 'paid_checkout_attribution_attested','release_horizon_reconciled']){
  const bad={...base};delete bad[field];
  assert.throws(()=>bound({eligibleFrameSize:1,horizonDays:30,cohortFrameVerified:true,
   observed:[bad]}),/Complete gross requires/);
  assert.throws(()=>bound({eligibleFrameSize:1,horizonDays:30,cohortFrameVerified:true,
   observed:[{...base,[field]:false}]}),/Complete gross requires/);
 }
 const good=bound({eligibleFrameSize:1,horizonDays:30,cohortFrameVerified:true,observed:[base]});
 assert.equal(good.lower_mean_gross_usd_cents,1000);
 assert.equal(good.point_identified,true);
 assert.equal(good.actual_platform_mean_gross,null);
});

test('Direct 4-decimal gross sales preserve interval bounds and never claim exact whole-cent revenue',()=>{
 const base=o('a',1000);
 delete base.gross_usd_cents;
 base.gross_sales_usd_4dp='10.0001';
 const x=bound({eligibleFrameSize:2,horizonDays:30,cohortFrameVerified:true,
  observed:[base],missing:[m('b',500,true)]});
 assert.equal(x.complete_observed_gross_usd_cents,null);
 assert.equal(x.complete_observed_gross_lower_usd_cents,1000);
 assert.equal(x.complete_observed_gross_upper_usd_cents,1001);
 assert.equal(x.decimal_gross_observations,1);
 assert.equal(x.lower_mean_gross_usd_cents,500);
 assert.equal(x.upper_mean_gross_usd_cents,750.5);
 assert.equal(x.point_identified,false);
 assert.equal(x.actual_platform_mean_gross,null);
});
test('Direct 4-decimal partial floors and verified caps conservatively widen uncertainty',()=>{
 const x=bound({eligibleFrameSize:2,horizonDays:30,cohortFrameVerified:true,
  observed:[o('a',1000)],
  missing:[{...m('b',null,false),observed_partial_gross_usd_4dp:'4.0001',
   partial_gross_verified:true,partial_horizon_attested:true,financial_access_attested:true,
   paid_checkout_attribution_attested:true,verified_upper_cap_usd_4dp:'49.9999',cap_verified:true}]});
 assert.equal(x.lower_mean_gross_usd_cents,700);
 assert.equal(x.upper_mean_gross_usd_cents,3000);
 assert.equal(x.observed_partial_floor_games,1);
 assert.equal(x.point_identified,false);
});
test('Reject incompatible amount representations, malformed four-decimal strings and missing totals',()=>{
 const both={...o('a',1000),gross_sales_usd_4dp:'10.0000'};
 assert.throws(()=>bound({eligibleFrameSize:1,horizonDays:30,cohortFrameVerified:true,
  observed:[both]}),/Exactly one cents or four-decimal/);
 const neither={...o('a',1000)};delete neither.gross_usd_cents;
 assert.throws(()=>bound({eligibleFrameSize:1,horizonDays:30,cohortFrameVerified:true,
  observed:[neither]}),/Exactly one cents or four-decimal/);
 const b={...partial('b',400),observed_partial_gross_usd_4dp:'4.0001'};
 assert.throws(()=>bound({eligibleFrameSize:1,horizonDays:30,cohortFrameVerified:true,
  missing:[b]}),/Exactly one cents or four-decimal/);
 const c={...m('c',500,true),verified_upper_cap_usd_4dp:'5.0001'};
 assert.throws(()=>bound({eligibleFrameSize:1,horizonDays:30,cohortFrameVerified:true,
  missing:[c]}),/Exactly one cents or four-decimal/);
 const d={...o('d',10),gross_usd_cents:undefined,gross_sales_usd_4dp:'1.23'};
 assert.throws(()=>bound({eligibleFrameSize:1,horizonDays:30,cohortFrameVerified:true,
  observed:[d]}),/four-decimal/);
});
test('Gross values with fractional cents cannot point-identify a reported mean without a precision interval',()=>{
 const a={...o('a',0),gross_sales_usd_4dp:'0.0001'};
 delete a.gross_usd_cents;
 const x=bound({eligibleFrameSize:1,horizonDays:30,cohortFrameVerified:true,observed:[a]});
 assert.equal(x.lower_mean_gross_usd_cents,0);
 assert.equal(x.upper_mean_gross_usd_cents,1);
 assert.equal(x.point_identified,false);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {HORIZONS,assessVideoLifecycle,compareLifecycleCohorts} from '../site/lifecycle-horizons.mjs';
const load=async name=>JSON.parse(await readFile(new URL('../'+name,import.meta.url),'utf8'));
const make=({n=365,cohort='evergreen',format='long_form',published_at='2026-08-24',as_of='2027-08-24',amount=2}={})=>({
 cohort,format,predeclared_cohort:true,published_at,as_of,view_metric_era:'post_2026_08_24',geography:'US',
 currency:'USD',authorized_owner_analytics:true,
 daily:Array.from({length:n},(_,i)=>({age_day:i,views:amount,estimated_revenue:amount/10}))
});
test('Horizon methodology uses 30,90,365 relative day boundaries and public source ids',async()=>{
 const [protocol,dossier]=await Promise.all([load('ontology/youtube/lifecycle-horizons.json'),load('specimens/youtube.json')]);
 assert.deepEqual(HORIZONS,[30,90,365]);
 assert.deepEqual(protocol.age_windows_days,HORIZONS);
 const ids=new Set(dossier.evidence.map(x=>x.id));
 assert(protocol.source_ids.every(id=>ids.has(id)));
 assert(Object.values(protocol.unmeasured).every(x=>x===null));
 assert(protocol.acceptance_gates.every(x=>x.pass===false));
});
test('Complete synthetic video provides cumulative views without extrapolation',()=>{
 const v=assessVideoLifecycle(make());
 assert.equal(v.status,'valid');
 assert.deepEqual(HORIZONS.map(n=>v.windows[n].value),[60,180,730]);
 assert(HORIZONS.every(n=>v.windows[n].missing_days===0));
});
test('Missing observations never become zero earnings',()=>{
 const x=make();x.daily.splice(15,1);
 const v=assessVideoLifecycle(x,{metric:'estimated_revenue'});
 assert.deepEqual(HORIZONS.map(n=>v.windows[n].value),[null,null,null]);
 assert.equal(v.windows['30'].status,'missing_observations');
});
test('Right-censor 90 and 365 day windows for a recently published video',()=>{
 const v=assessVideoLifecycle(make({n:31,as_of:'2026-09-23'}));
 assert.equal(v.windows['30'].status,'measured');
 assert.equal(v.windows['90'].status,'right_censored');
 assert.equal(v.windows['365'].value,null);
});
test('August 2026 definition break prohibits mixed-era view totals',()=>{
 const before=make({n:90,published_at:'2026-08-01',as_of:'2026-11-01'});
 before.view_metric_era='pre_2026_08_24';
 const v=assessVideoLifecycle(before);
 assert.equal(v.windows['30'].status,'definition_break');
 assert.equal(v.windows['90'].value,null);
 assert.equal(assessVideoLifecycle(before,{metric:'estimated_revenue'}).windows['30'].status,'measured');
});
test('Observed true zero and unknown revenue retain different interpretation',()=>{
 const zero=make({amount:0}),unknown=make();
 assert.equal(assessVideoLifecycle(zero,{metric:'estimated_revenue'}).windows['30'].value,0);
 unknown.daily[2].estimated_revenue=null;
 assert.equal(assessVideoLifecycle(unknown,{metric:'estimated_revenue'}).windows['30'].value,null);
 unknown.authorized_owner_analytics=false;
 assert.equal(assessVideoLifecycle(unknown,{metric:'estimated_revenue'}).status,'invalid');
});
test('Matched descriptive comparison retains source cohort denominator and observed zeros',()=>{
 const a=make({amount:0}),b=make({cohort:'trend_or_event',amount:4});
 const r=compareLifecycleCohorts([a,b],{metric:'estimated_revenue',horizon:90});
 assert.equal(r.status,'descriptive_only');
 assert.deepEqual(r.groups.map(g=>g.entry_n),[1,1]);
 assert.deepEqual(r.groups.map(g=>g.observed_zero_n),[1,0]);
 assert.equal(r.groups[0].sample_median,0);
 assert.equal(r.groups[1].sample_mean,36);
});
test('Cross-geography, cross-format, currency and unregistered cohort invalid',()=>{
 const a=make(),b=make({cohort:'trend_or_event'});
 b.geography='MX';
 assert.equal(compareLifecycleCohorts([a,b]).status,'incompatible_cohorts');
 b.geography='US';b.format='shorts';
 assert.equal(compareLifecycleCohorts([a,b]).status,'incompatible_cohorts');
 b.format='long_form';b.currency='MXN';
 assert.equal(compareLifecycleCohorts([a,b],{metric:'estimated_revenue'}).status,'incompatible_cohorts');
 b.currency='USD';b.predeclared_cohort=false;
 assert.equal(compareLifecycleCohorts([a,b]).status,'invalid');
});
test('Reject impossible observed dates, duplicate days and individual records',()=>{
 const x=make();x.daily.push({...x.daily[0]});
 assert.equal(assessVideoLifecycle(x).status,'invalid');
 x.daily.pop();x.includes_individual_identifiers=true;
 assert.equal(assessVideoLifecycle(x).status,'invalid');
});

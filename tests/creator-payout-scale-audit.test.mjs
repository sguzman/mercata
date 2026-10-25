import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {canAggregatePayoutWindows,inferIndividualPayout} from '../site/creator-payout-scale-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('YouTube aggregate payout values are sourced and keyed to their payment frames',async()=>{
 const [m,s]=await Promise.all([load('ontology/youtube/platform-creator-payout-scale.json'),load('specimens/youtube.json')]);
 assert(m.source_ids.every(id=>s.evidence.some(x=>x.id===id)));
 assert.equal(m.reported_windows.length,3);
 assert.deepEqual(m.reported_windows.map(x=>x.value_usd_billions),[100,100,8]);
 assert.deepEqual(m.reported_windows[0].reporting_window_start,'2021-01-01');
 assert.deepEqual(m.reported_windows[0].reporting_window_end,'2024-12-31');
 assert.equal(m.reported_windows[1].reporting_window_start,null);
 assert.equal(m.reported_windows[1].reporting_window_end,null);
 assert.equal(m.reported_windows[2].reporting_window_start,'2024-07-01');
 assert.equal(m.reported_windows[2].reporting_window_end,'2025-06-30');
 assert(m.reported_windows.every(x=>x.individual_creator_only===false && x.includes_intermediaries===true));
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('Payout totals cannot be summed as disjoint cash totals or turned into mean creator pay',async()=>{
 const m=await load('ontology/youtube/platform-creator-payout-scale.json');
 const a=m.reported_windows.map(x=>x.id);
 for(const pair of [[a[0],a[1]],[a[0],a[2]],[a[1],a[2]]]){
  assert.equal(canAggregatePayoutWindows(m,pair).allowed,false);
 }
 assert.equal(canAggregatePayoutWindows(m,[a[0],a[0]]).allowed,false);
 assert.equal(canAggregatePayoutWindows(m,[a[1],a[2]]).reason,'Unbounded rolling four-year statement');
 assert.deepEqual(inferIndividualPayout(m),{allowed:false,mean:null,median:null});
});
test('Website keeps payouts distinct from individual creator income',async()=>{
 const site=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(site.includes('renderCreatorPayoutScale'));
 assert(site.includes('platform-creator-payout-scale.json'));
 assert(site.includes('not individual earnings'));
});

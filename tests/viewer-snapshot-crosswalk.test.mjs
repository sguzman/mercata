import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {describeViewerSnapshot,contrastViewerSnapshots} from '../site/viewer-snapshot-crosswalk.mjs';
const read=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
const model=(await read('ontology/youtube/retention-posts-memberships.json')).viewer_funnel_comparability;
const example=(v={})=>({owner_authorized:true,reporting_surface:'youtube_studio_owner',
 aggregated_only:true,metric:'monthly_audience_estimated_viewers',
 window_days:28,end_date:'2026-09-30',audience:1000,new:650,casual:250,regular:80,...v});
test('Official audiences are rolling 28-day owner estimates, not observed transitions',async()=>{
 const d=await read('specimens/youtube.json');
 assert(model.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.equal(model.monthly_audience_window_days,28);
 assert.equal(model.segment_counts_are_transition_records,false);
 assert.equal(model.observed_authorized_channels,0);
 const x=describeViewerSnapshot(model,example());
 assert.equal(x.valid,true);
 assert.deepEqual(x.shares,{new:0.65,casual:0.25,regular:0.08});
 assert.equal(x.new_to_regular_conversion,null);
});
test('Two aggregate time points never give conversion or identified retention',()=>{
 const x=contrastViewerSnapshots(model,example(),example({end_date:'2026-10-01',new:620,regular:90}));
 assert.equal(x.status,'two_aggregate_snapshots_not_a_transition');
 assert.equal(x.change_in_reported_regular_count,10);
 assert.equal(x.new_to_regular_conversion,null);
 assert.equal(x.identified_viewer_retention,null);
});
test('Reject public view proxies, missing owner access, invalid windows and negative counts',()=>{
 for(const bad of [{owner_authorized:false},{reporting_surface:'public_api'},
  {aggregated_only:false},{metric:'public_views'},{window_days:30},
  {end_date:'2026-02-30'},{audience:0},{regular:-1},{new:1.5}])
  assert.equal(describeViewerSnapshot(model,example(bad)).valid,false,JSON.stringify(bad));
});
test('Privacy-suppressed or incomplete group counts do not become zero',()=>{
 const x=describeViewerSnapshot(model,example({casual:null}));
 assert.equal(x.valid,true);assert.equal(x.shares,null);
 assert.equal(contrastViewerSnapshots(model,example({casual:null}),
  example({end_date:'2026-10-01'})).new_to_regular_conversion,null);
});

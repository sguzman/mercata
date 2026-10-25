import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {getEngagedViewObservation,compareViewMetricUnits,assessBrowseGapClaim} from '../site/agentio-engaged-view-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Distinct modeled and observed 2026 view cohorts are attributable and not generalized',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/agentio-engaged-view-series-2026.json'),load('specimens/youtube.json')]);
 assert(m.source_ids.every(id=>d.evidence.some(x=>x.id===id)));
 assert.equal(m.studies.length,2);
 assert.equal(m.studies[0].creator_videos,35800);
 assert.equal(m.studies[0].organic_engagement_threshold_confirmed_by_youtube,false);
 assert.equal(m.studies[1].sample_videos_strictly_greater_than,75000);
 assert.equal(m.studies[1].public_views_millions_rounded,549);
 assert.equal(m.studies[1].engaged_views_millions_rounded,330);
 assert.equal(m.studies[1].reported_engaged_views_per_public_views_percent_approx,60);
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('Thirty-second retention forecast never becomes direct observed YT engagement',async()=>{
 const m=await load('ontology/youtube/agentio-engaged-view-series-2026.json');
 const a=getEngagedViewObservation(m,'prechange_retention_proxy','modeled_public_view_lift');
 assert.equal(a.status,'modeled_not_observed');assert.equal(a.percent,30);
 assert.equal(getEngagedViewObservation(m,'prechange_retention_proxy','selected_postchange_engaged_share').allowed,false);
 const b=getEngagedViewObservation(m,'postchange_permissioned_counts','selected_postchange_engaged_share');
 assert.equal(b.status,'observed_vendor_selected');assert.equal(b.percent,60);assert.equal(b.platformwide_conversion,null);
});
test('Cross August public views, creator pay and browse gap cannot be misinterpreted',async()=>{
 const m=await load('ontology/youtube/agentio-engaged-view-series-2026.json');
 assert.equal(compareViewMetricUnits(m,{metric:'public_view',crosses_definition_change:true}).comparable,false);
 assert.equal(compareViewMetricUnits(m,{metric:'public_view',claim:'creator_profit'}).comparable,false);
 assert.equal(compareViewMetricUnits(m,{metric:'engaged_view',claim:'global_engaged_fraction'}).comparable,false);
 assert.equal(compareViewMetricUnits(m,{metric:'public_view'}).comparable,true);
 assert.equal(assessBrowseGapClaim(m,'all_views').allowed,false);
 assert.equal(assessBrowseGapClaim(m,'total_unengaged_gap').percent,77);
});
test('Site presents the observed 75k-videos as sampled, not all Youtube people',async()=>{
 const site=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(site.includes('renderAgentioEngagedViews'));
 assert(site.includes('agentio-engaged-view-series-2026.json'));
 assert(site.includes('not a universal engaged-to-public conversion factor'));
});

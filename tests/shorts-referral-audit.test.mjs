import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {assessShortsReferral,auditShortsFunnelProtocol} from '../site/shorts-referral-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
const synthetic={source_format:'shorts',destination_format:'regular_video',source_channel_id:'channel-x',channel_id:'channel-x',source_video_id:'short-a',destination_video_id:'video-b',period_start:'2026-09-01',period_end:'2026-09-30',measurement_epoch:'post_2026_08_24',related_video_feature_verified:true,destination_visibility:'public',authorization:'owner_consent',direct_link_event_linkage_verified:true,unit:'attributed_event_pairs',attributed_click_events:100,matched_destination_event_pairs:18};
test('Protocol preserves official source IDs but has no measured funnel',async()=>{
 const [study,dossier]=await Promise.all([load('ontology/youtube/shorts-related-video-funnel.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditShortsFunnelProtocol(study,new Set(dossier.evidence.map(x=>x.id))),{valid:true,errors:[]});
});
test('A strictly linked synthetic event-pair count is descriptive and not causal',()=>{
 const x=assessShortsReferral(synthetic);assert.equal(x.status,'descriptive_attributed_event_pairs');assert.equal(x.descriptive_event_pair_rate,0.18);assert.equal(x.causal_lift_verified,false);
});
test('Unrelated Shorts/view totals and ineligible links cannot masquerade as conversions',()=>{
 for(const sample of [
  {...synthetic,direct_link_event_linkage_verified:false},
  {...synthetic,unit:'short_views'},
  {...synthetic,unit:'unique_people'},
  {...synthetic,destination_visibility:'private'},
  {...synthetic,related_video_feature_verified:false},
  {...synthetic,attributed_click_events:10,matched_destination_event_pairs:18},
  {...synthetic,authorization:'scraped_public_video_stats'},
  {...synthetic,period_start:'2026-10-01',period_end:'2026-09-30'}
 ]){const x=assessShortsReferral(sample);assert.equal(x.status,'not_identifiable');assert.equal(x.descriptive_event_pair_rate,null);}
});
test('Zero source clicks never imply zero profit or a conversion rate',()=>{
 const x=assessShortsReferral({...synthetic,attributed_click_events:0,matched_destination_event_pairs:0});
 assert.equal(x.status,'no_attributed_clicks');assert.equal(x.descriptive_event_pair_rate,null);
});

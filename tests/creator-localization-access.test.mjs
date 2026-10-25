import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {assessCreatorLocalizationRoute,inferLocalizationAudience} from '../site/creator-localization-access.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Six localization routes are attributed to distinct official documents',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/creator-localization-access-2026.json'),load('specimens/youtube.json')]);
 const sourceIds=new Set(d.evidence.map(x=>x.id));
 assert.equal(m.routes.length,6);
 assert(m.source_ids.every(id=>sourceIds.has(id)));
 assert(m.routes.every(x=>x.source_ids.every(id=>sourceIds.has(id))));
 assert.equal(m.account_linked,false);assert.equal(m.language_specific_audience_measurements.length,0);
 assert(Object.values(m.unknown).every(x=>x===null));
});
test('Manually supplied captions are not gated by ASR or paid audio features',async()=>{
 const m=await load('ontology/youtube/creator-localization-access-2026.json');
 const r=assessCreatorLocalizationRoute(m,'manual_caption',{owns_video:true,language_selected:true,caption_text_ready:true});
 assert.equal(r.status,'passes_documented_feature_gates');assert.equal(r.verified_audience_gain,null);
 assert.equal(assessCreatorLocalizationRoute(m,'manual_caption',{owns_video:true}).status,'unknown');
 assert.equal(assessCreatorLocalizationRoute(m,'automatic_caption',{owns_video:true,language_supported_for_asr:false,recognized_speech:true}).status,'ineligible_by_stated_feature_gates');
 assert.equal(assessCreatorLocalizationRoute(m,'localized_title_description',{owns_video:true,language_selected:true,translated_metadata_ready:true}).status,'passes_documented_feature_gates');
 assert.equal(assessCreatorLocalizationRoute(m,'manual_multi_audio',{owns_video:true,multi_audio_feature_access:false,alternate_audio_file_ready:true}).status,'ineligible_by_stated_feature_gates');
});
test('Automatic dubbing has independent video duration and source-language gates',async()=>{
 const m=await load('ontology/youtube/creator-localization-access-2026.json');
 const base={owns_video:true,auto_dubbing_access:true,source_language_recognized:true,spoken_content_present:true,supported_language_pair:true,no_disqualifying_rights_claim:true,videoMinutes:119};
 assert.equal(assessCreatorLocalizationRoute(m,'automatic_dubbing',base).status,'passes_documented_feature_gates');
 assert.equal(assessCreatorLocalizationRoute(m,'automatic_dubbing',{...base,videoMinutes:121}).status,'ineligible_by_stated_feature_gates');
 assert.equal(assessCreatorLocalizationRoute(m,'automatic_dubbing',{...base,source_language_recognized:false}).status,'ineligible_by_stated_feature_gates');
 assert.equal(assessCreatorLocalizationRoute(m,'automatic_dubbing',{...base,videoMinutes:null}).status,'unknown');
});
test('Multilingual product options do not imply any measured search, viewer or earning increase',async()=>{
 const m=await load('ontology/youtube/creator-localization-access-2026.json');
 for(const claim of ['translated_search_demand','unique_viewers','improved_creator_rpm','causal_recommendation_increase'])
  assert.equal(inferLocalizationAudience(m,claim).allowed,false);
 assert.equal(assessCreatorLocalizationRoute(m,'viewer_preferred_language',{alternate_audio_or_metadata_available:true}).verified_creator_pay,null);
});
test('Website renders official access matrix with no unverified earnings',async()=>{
 const source=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(source.includes('renderCreatorLocalizationAccess'));
 assert(source.includes('creator-localization-access-2026.json'));
 assert(source.includes('not measured multilingual audience or creator income'));
});

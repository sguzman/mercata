import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {summarizeVideoLanguageMetadata,assessLanguageInference} from '../site/language-audience-crosswalk.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Official language field definitions cite the registered sources, without population guesses',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/language-audience-api-crosswalk-2026.json'),load('specimens/youtube.json')]);
 assert(m.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
 assert.equal(m.sources_and_units.length,7);
 assert.equal(m.actual_observations.length,0);
 assert.equal(m.global_user_language_counts,null);
 assert.equal(m.representative_primary_language_distribution,null);
});
test('Sample keeps title-language and default-audio-language separate, including missing labels',()=>{
 const out=summarizeVideoLanguageMetadata([
  {video_id:'a',default_audio_language:'es-MX',default_metadata_language:'en'},
  {video_id:'b',default_audio_language:'es-MX',default_metadata_language:'es-MX'},
  {video_id:'c',default_audio_language:null,default_metadata_language:'en'},
  {video_id:'d',default_audio_language:'ar',default_metadata_language:null}
 ]);
 assert.equal(out.video_count,4);
 assert.equal(out.audio_language_counts['es-mx'],2);
 assert.equal(out.metadata_language_counts.en,2);
 assert.equal(out.unknown_audio_count,1);
 assert.equal(out.unknown_metadata_count,1);
 assert.equal(out.actual_language_speakers,null);
 assert.equal(out.representative_youtube_language_market,null);
});
test('Reject duplicate video IDs and unjustified guessed language codes',()=>{
 assert.throws(()=>summarizeVideoLanguageMetadata([{video_id:'a',default_audio_language:'es',default_metadata_language:null},{video_id:'a',default_audio_language:'en',default_metadata_language:'en'}]),/Duplicate/);
 assert.throws(()=>summarizeVideoLanguageMetadata([{video_id:'b',default_audio_language:'NOT A LANGUAGE',default_metadata_language:'en'}]),/Malformed/);
 assert.throws(()=>summarizeVideoLanguageMetadata([{video_id:'x',default_audio_language:undefined,default_metadata_language:'en'}]),/Malformed/);
});
test('A country or translated title is not evidence of an audience language or ethnicity',()=>{
 assert.equal(assessLanguageInference('analytics_country','owner_authorized_view_activity_country').allowed,true);
 assert.equal(assessLanguageInference('analytics_country','national_first_language_population').allowed,false);
 assert.equal(assessLanguageInference('default_metadata_language','selected_video_default_audio_tag_count').allowed,false);
 assert.equal(assessLanguageInference('caption_track_language','authorized_caption_track_metadata').allowed,true);
 assert.equal(assessLanguageInference('default_audio_language','creator_earning_population').allowed,false);
});
test('Public dossier preserves language versus geography and unknowns',async()=>{
 const site=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(site.includes('renderLanguageAudienceCrosswalk'));
 assert(site.includes('language-audience-api-crosswalk-2026.json'));
 assert(site.includes('country is not language'));
});

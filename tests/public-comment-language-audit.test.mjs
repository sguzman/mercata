import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditPublicCommentLanguageFrame,auditLanguageParticipationClaim} from '../site/public-comment-language-audit.mjs';
const load=async x=>JSON.parse(await readFile(new URL('../'+x,import.meta.url),'utf8'));
test('Source-backed language crosswalk preserves published comment event and video metadata differences',async()=>{
 const [m,s]=await Promise.all([load('ontology/youtube/public-comment-language-protocol-2026.json'),load('specimens/youtube.json')]);
 assert(m.source_ids.every(id=>s.evidence.some(e=>e.id===id)));
 assert.equal(m.comment_population.all_replies_in_thread_endpoint_complete,false);
 assert.equal(m.comment_population.comment_language_metadata_provided_by_youtube,false);
 assert.equal(m.video_language_fields[0].id,'defaultLanguage');
 assert.equal(m.video_language_fields[1].id,'defaultAudioLanguage');
 assert.equal(m.study_frame.sampled_comment_event_count,0);
 assert.equal(m.all_youtube_language_users,null);
});
test('Comparable aggregate language studies must have complete accessible pagination and no stored identities',async()=>{
 const m=await load('ontology/youtube/public-comment-language-protocol-2026.json');
 const x={creatorSampleFrame:'public channels',window:'2026-10',selectionRule:'predeclared list',languageMethod:'aggregate manual',unknownLanguageEvents:0,
  topLevelPaginationComplete:true,replyPaginationComplete:true,eventDenominator:'public_comment_events'};
 assert.equal(auditPublicCommentLanguageFrame(m,x).valid,true);
 assert.equal(auditPublicCommentLanguageFrame(m,{...x,storeAuthorIds:true}).valid,false);
 assert.equal(auditPublicCommentLanguageFrame(m,{...x,replyPaginationComplete:false}).valid,false);
 assert.equal(auditPublicCommentLanguageFrame(m,{...x,eventDenominator:'all_youtube_viewers'}).valid,false);
});
test('No public comment language observation establishes unique speakers or demographics',async()=>{
 const m=await load('ontology/youtube/public-comment-language-protocol-2026.json');
 assert.equal(auditLanguageParticipationClaim(m,'sampled_public_comment_event_language').allowed,true);
 assert.equal(auditLanguageParticipationClaim(m,'viewer_spoken_language').allowed,false);
 assert.equal(auditLanguageParticipationClaim(m,'viewer_religious_identity').allowed,false);
 assert.equal(auditLanguageParticipationClaim(m,'youtube_language_population').allowed,false);
});

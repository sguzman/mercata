import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditRelativeVideoBreakouts,summarizeIndexedVideoBreakout} from '../site/relative-video-breakout-audit.mjs';
const read=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Source dates, 3581 unscored videos and 555158 format-scored videos reconcile exactly',async()=>{
 const [m,d]=await Promise.all([read('ontology/youtube/relative-video-breakouts-2026.json'),read('specimens/youtube.json')]);
 const audit=auditRelativeVideoBreakouts(m,new Set(d.evidence.map(x=>x.id)));
 assert.deepEqual(audit,{valid:true,errors:[]});
 assert.equal(m.total_indexed_videos,558739);
 assert.equal(m.total_indexed_channels,6663);
 assert.equal(m.unscored_videos,3581);
 assert.equal(m.format_groups.reduce((s,x)=>s+x.video_count,0),555158);
 assert.equal(m.small_channel_5x_cases_selected.find(x=>x.niche==='Gaming').channels_under_10000_subscribers_with_at_least_one_5x_video,null);
});
test('5x hit counts are relative video observations, not niche opportunity or salary distributions',async()=>{
 const m=await read('ontology/youtube/relative-video-breakouts-2026.json');
 const a=summarizeIndexedVideoBreakout(m,'shorts');
 assert.equal(a.video_count,272813);
 assert.equal(a.five_x_or_more_percent,10.6);
 assert.equal(a.absolute_creator_income,null);
 assert.equal(a.all_youtube_newcomer_success_probability,null);
 assert.equal(a.causal_format_effect,null);
 assert.equal(summarizeIndexedVideoBreakout(m,'live').allowed,false);
});
test('Audit refuses invented denominator, unsourced payout and fabricated opportunity rank',async()=>{
 const [m,d]=await Promise.all([read('ontology/youtube/relative-video-breakouts-2026.json'),read('specimens/youtube.json')]);
 const known=new Set(d.evidence.map(x=>x.id));
 const x=structuredClone(m);
 x.small_channel_5x_cases_selected[0].total_indexed_niche_channels_under_10000=50;
 assert(auditRelativeVideoBreakouts(x,known).errors.some(x=>x.includes('denominators')));
 const y=structuredClone(m);y.amount_of_money_for_5x=5000;
 assert(auditRelativeVideoBreakouts(y,known).errors.some(x=>x.includes('payout')));
 const z=structuredClone(m);z.proprietary_niche_opportunity_scores_as_empirical_success_probability_allowed=true;
 assert(auditRelativeVideoBreakouts(z,known).errors.some(x=>x.includes('Ranking')));
});

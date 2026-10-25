import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {assessVTuberInference,combineBuyerGroups} from '../site/vtuber-superchat-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('CHI 2025 selected cohort preserves observed mean, median, zero event and denominator',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/vtuber-superchat-cohort-2025.json'),load('specimens/youtube.json')]);
 assert(d.evidence.some(x=>x.id===m.source_id));
 assert.equal(m.frame.studied_channels,1923);
 assert.equal(m.creator_superchats.reported_monthly_mean_usd_equivalent,2667);
 assert.equal(m.creator_superchats.reported_monthly_median_usd_equivalent,127);
 assert.equal(m.creator_superchats.channels_without_superchat_reported_fraction,0.25);
 assert.equal(m.creator_superchats.gini_2023_approx,0.75);
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('Reported chat rates are conditional and non-additive',async()=>{
 const m=await load('ontology/youtube/vtuber-superchat-cohort-2025.json');
 assert.equal(m.commenter_conversion.public_chat_posting_accounts_approx,6750000);
 assert.equal(m.commenter_conversion.posted_at_least_one_superchat_percent,7.96);
 assert.equal(m.commenter_conversion.purchased_at_least_one_membership_percent,12.65);
 assert.equal(combineBuyerGroups(m).allowed,false);
 assert.equal(assessVTuberInference(m,{kind:'selected_public_chat_sender_superchat_share',population:'public_chat_posting_accounts'}).allowed,true);
 assert.equal(assessVTuberInference(m,{kind:'selected_public_chat_sender_superchat_share',population:'all_youtube_viewers'}).allowed,false);
});
test('Zero Superchats do not establish zero creator earnings and sampled USD is not net profit',async()=>{
 const m=await load('ontology/youtube/vtuber-superchat-cohort-2025.json');
 const x=assessVTuberInference(m,{kind:'selected_cohort_zero_superchat_share',population:'selected_vtuber_cohort'});
 assert.equal(x.allowed,true);assert.equal(x.value,0.25);assert.equal(x.verified_net_creator_profit,null);
 assert.equal(assessVTuberInference(m,{kind:'all_creator_zero_income',population:'selected_vtuber_cohort'}).allowed,false);
 assert.equal(assessVTuberInference(m,{kind:'selected_cohort_mean_public_superchat',population:'all_youtube_creators'}).allowed,false);
 assert.equal(assessVTuberInference(m,{kind:'verified_creator_profit',population:'selected_vtuber_cohort'}).allowed,false);
});
test('Site presents the selected VTuber evidence separately from ordinary creator income',async()=>{
 const a=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(a.includes('renderVTuberSuperchatStudy'));
 assert(a.includes('vtuber-superchat-cohort-2025.json'));
 assert(a.includes('not zero total earnings'));
});

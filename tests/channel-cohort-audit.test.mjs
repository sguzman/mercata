import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditChannelCohorts} from '../site/channel-cohort-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Vendor-indexed cohorts reconcile exactly and remain separate source frames',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/channel-cohort-observations-2026.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditChannelCohorts(m,new Set(d.evidence.map(x=>x.id))),{valid:true,errors:[]});
 assert.equal(m.datasets[2].bins.reduce((sum,x)=>sum+x.reached_1000_at_end,0),500409);
});
test('Rejects claims that milestone groups are new creator YPP cohorts',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/channel-cohort-observations-2026.json'),load('specimens/youtube.json')]);
 m.datasets[2].ypp_approvals_verified=500409;m.datasets[2].new_entrants_only=true;
 m.datasets[0].milestones[0].channels=999999999;
 m.unmeasured.net_profit=25;
 const result=auditChannelCohorts(m,new Set(d.evidence.map(x=>x.id)));
 assert.equal(result.valid,false);
 assert(result.errors.includes('invented cohort type or monetization'));
 assert(result.errors.includes('invalid cumulative milestones'));
 assert(result.errors.includes('unmeasured results invented'));
});
test('Published 360-day subgroup bin estimates are conditional observations only',async()=>{
 const m=await load('ontology/youtube/channel-cohort-observations-2026.json');
 assert.equal(m.datasets[2].window_days,360);
 assert.equal(m.datasets[2].bins[3].reported_percent,30.77);
 assert.equal(m.datasets[2].actual_upload_events_observed,false);
 assert(m.prohibited_interpretations.some(x=>x.includes('causes')));
});

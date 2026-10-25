import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {auditYouTubeHistory} from '../site/youtube-history-audit.mjs';
const load=async file=>JSON.parse(await fs.readFile(new URL('../'+file,import.meta.url),'utf8'));
test('Dated ownership and monetization history has source-backed events and future-policy separation',async()=>{
 const [h,d]=await Promise.all([load('ontology/youtube/monetization-history-2006-2027.json'),load('specimens/youtube.json')]);
 const known=new Set(d.evidence.map(x=>x.id));
 assert.deepEqual(auditYouTubeHistory(h,known),{valid:true,errors:[],count:13});
 assert.equal(h.events[0].id,'acquisition');
 assert.equal(h.events.at(-1).effective_from,'2027-02-01');
 assert.equal(h.events.find(x=>x.id==='hours_subs_gate').effective_from,'2018-02-20');
 assert.equal(h.events.find(x=>x.id==='shorts_announced').thresholds.creator_share_of_allocated_shorts_pool_percent,45);
 assert.equal(h.events.find(x=>x.id==='early_funding').thresholds.subscribers,500);
 assert(Object.values(h.unmeasured).every(v=>v===null));
});
test('Timeline rejects unsupported revenue, unsourced entries, backwards dates and premature policy',async()=>{
 const [h,d]=await Promise.all([load('ontology/youtube/monetization-history-2006-2027.json'),load('specimens/youtube.json')]);
 const known=new Set(d.evidence.map(x=>x.id)),copy=()=>structuredClone(h);
 const a=copy();a.events.at(-1).effective_from='2026-01-01';assert(!auditYouTubeHistory(a,known).valid);
 const b=copy();b.events[2].source_ids=['missing'];assert(!auditYouTubeHistory(b,known).valid);
 const c=copy();c.events[2].median_creator_income=1;assert(!auditYouTubeHistory(c,known).valid);
 const e=copy();e.events[2].event_date='2001-01-01';assert(!auditYouTubeHistory(e,known).valid);
});

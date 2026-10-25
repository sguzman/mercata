import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditInactivityFrames} from '../site/creator-inactivity-audit.mjs';
const load=async name=>JSON.parse(await fs.readFile(new URL('../'+name,import.meta.url),'utf8'));
test('Distinct 30-day, 90-day, year, and net-video-count frames remain separate',async()=>{
 const [data,dossier,cohorts]=await Promise.all(['ontology/youtube/creator-inactivity-frames-2026.json','specimens/youtube.json','ontology/youtube/channel-cohort-observations-2026.json'].map(load));
 const known=new Set(dossier.evidence.map(x=>x.id));
 assert.deepEqual(auditInactivityFrames(data,known,cohorts),{valid:true,errors:[]});
 assert.equal(data.frames[0].dormant_pct,57);
 assert.equal(data.frames[1].no_upload_one_year_pct,27);
 assert.equal(data.frames[2].no_upload_pct,null);
 assert.equal(data.frames[2].no_net_video_growth_count,27360211);
 assert(Object.values(data.unmeasured).every(v=>v===null));
});
test('Inactivity audit rejects false channel closures, pooling, and derived inactivity from counts',async()=>{
 const [data,dossier,cohorts]=await Promise.all(['ontology/youtube/creator-inactivity-frames-2026.json','specimens/youtube.json','ontology/youtube/channel-cohort-observations-2026.json'].map(load));
 const known=new Set(dossier.evidence.map(x=>x.id)),copy=()=>structuredClone(data);
 const a=copy();a.frames[0].dead_or_closed_pct=57;assert(!auditInactivityFrames(a,known,cohorts).valid);
 const b=copy();b.cross_frame_comparison_allowed=true;assert(!auditInactivityFrames(b,known,cohorts).valid);
 const c=copy();c.frames[2].no_upload_pct=83;assert(!auditInactivityFrames(c,known,cohorts).valid);
 const d=copy();d.frames[1].no_upload_one_year_pct=46;assert(!auditInactivityFrames(d,known,cohorts).valid);
});

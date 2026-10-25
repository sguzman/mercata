import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditEducationLongitudinalCase} from '../site/longitudinal-education-audit.mjs';
const load=async p=>JSON.parse(await fs.readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Single-channel longitudinal study retains 51 videos, channel view averages and retention percentages',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/lifecycle-horizons.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditEducationLongitudinalCase(m,new Set(d.evidence.map(x=>x.id))),{valid:true,errors:[]});
 assert.equal(m.single_channel_evergreen_longitudinal_observation.selected_video_count,51);
 assert.equal(m.single_channel_evergreen_longitudinal_observation.owner_total_revenue,null);
});
test('A longitudinal teaching video case is not a profit or randomized evergreen comparison',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/lifecycle-horizons.json'),load('specimens/youtube.json')]);
 const ids=new Set(d.evidence.map(x=>x.id)),copy=()=>structuredClone(m);
 const a=copy();a.single_channel_evergreen_longitudinal_observation.identified_causal_effect=0.5;assert(!auditEducationLongitudinalCase(a,ids).valid);
 const b=copy();b.single_channel_evergreen_longitudinal_observation.net_earnings=500;assert(!auditEducationLongitudinalCase(b,ids).valid);
 const c=copy();c.single_channel_evergreen_longitudinal_observation.selected_video_count=500;assert(!auditEducationLongitudinalCase(c,ids).valid);
});

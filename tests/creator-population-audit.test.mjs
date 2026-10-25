import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditCreatorPopulation} from '../site/creator-population-audit.mjs';
const load=async p=>JSON.parse(await fs.readFile(new URL('../'+p,import.meta.url),'utf8'));
const paths=['ontology/youtube/creator-activity-population-2026.json','ontology/youtube/channel-cohort-observations-2026.json','ontology/youtube/creator-index-comparison-2026.json','specimens/youtube.json'];
test('Unmatched vendor channel frames remain separate from people and earning creators',async()=>{
 const [data,co,idx,spec]=await Promise.all(paths.map(load));
 assert.deepEqual(auditCreatorPopulation(data,co,idx,new Set(spec.evidence.map(x=>x.id))),{valid:true,errors:[]});
 assert.deepEqual(data.frames.map(x=>x.channel_count),[61186246,11752034,32926088,2153140]);
 assert(data.frames.every(x=>x.active_uploader_count===null&&x.account_owner_people_count===null));
});
test('Population gate prevents treating a net video change as unique active people',async()=>{
 const [data,co,idx,spec]=await Promise.all(paths.map(load));
 const known=new Set(spec.evidence.map(x=>x.id)),copy=()=>structuredClone(data);
 const a=copy();a.frames[1].active_uploader_count=11752034;assert(!auditCreatorPopulation(a,co,idx,known).valid);
 const b=copy();b.frames[2].channel_count=0;assert(!auditCreatorPopulation(b,co,idx,known).valid);
 const c=copy();c.unmeasured.global_monthly_creators_with_upload_event=100000000;assert(!auditCreatorPopulation(c,co,idx,known).valid);
});

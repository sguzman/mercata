import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {calculateVideoConcentration,auditVideoConcentrationStudy} from '../site/niche-attention-concentration.mjs';
const base={frame_id:'mock',topic:'art',country:'MX',language:'es',format:'long',start:'2026-10-01',end:'2026-10-07'};
const rows=[0,0,20,80].map((views,i)=>({...base,video_id:String(i),views,estimatedMinutesWatched:views*2}));
test('Video concentration arithmetic uses matched complete denominator, not income',()=>{
 const x=calculateVideoConcentration(rows,{fraction:.25});
 assert.equal(x.valid,true);assert.equal(x.top_share,.8);assert(Math.abs(x.hhi-.68)<1e-12);assert(Math.abs(x.gini-.65)<1e-12);assert.equal(x.creator_profit,null);
});
test('Cannot mix frames, duplicate IDs or invent nonview metrics',()=>{
 const a=structuredClone(rows);a[1].country='US';assert.equal(calculateVideoConcentration(a).valid,false);
 const b=structuredClone(rows);b[1].video_id='0';assert.equal(calculateVideoConcentration(b).valid,false);
 assert.equal(calculateVideoConcentration(rows,{metric:'money'}).valid,false);
 assert.equal(calculateVideoConcentration(rows.map(r=>({...r,views:0}))).valid,false);
});
test('Study makes no observed niche claims',async()=>{
 const read=async p=>JSON.parse(await fs.readFile(new URL('../'+p,import.meta.url),'utf8'));
 const [model,dossier]=await Promise.all([read('ontology/youtube/niche-attention-concentration-2026.json'),read('specimens/youtube.json')]);
 assert.deepEqual(auditVideoConcentrationStudy(model,new Set(dossier.evidence.map(x=>x.id))),{valid:true,errors:[]});
});

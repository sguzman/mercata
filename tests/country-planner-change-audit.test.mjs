import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditPlannerChangeWindows} from '../site/country-planner-change-audit.mjs';
const load=async f=>JSON.parse(await fs.readFile(new URL('../'+f,import.meta.url),'utf8'));
test('Four publisher-reported change windows retain different period and measured units',async()=>{
 const [m,b,d]=await Promise.all(['ontology/youtube/country-planner-change-windows-2026.json','ontology/youtube/country-ad-reach-comparisons.json','specimens/youtube.json'].map(load));
 assert.deepEqual(auditPlannerChangeWindows(m,b,new Set(d.evidence.map(x=>x.id))),{valid:true,errors:[],countries:4});
 const india=m.countries.find(x=>x.code==='IN'),japan=m.countries.find(x=>x.code==='JP');
 assert.equal(india.reported_end_2024_to_late_2025.change_million,9);
 assert.equal(india.reported_july_to_oct_2025.change_million,-9);
 assert.equal(japan.reported_end_2024_to_late_2025.change_percent,-0.3);
 assert.equal(japan.reported_july_to_oct_2025.change_percent,4.1);
 assert(m.countries.every(x=>x.active_people_change===null&&x.unique_mau===null));
});
test('Rejects altered publisher figures, made-up unique viewers, or invented stable sampling panels',async()=>{
 const [m,b,d]=await Promise.all(['ontology/youtube/country-planner-change-windows-2026.json','ontology/youtube/country-ad-reach-comparisons.json','specimens/youtube.json'].map(load));
 const sources=new Set(d.evidence.map(x=>x.id)),copy=()=>structuredClone(m);
 const x=copy();x.countries[0].reported_july_to_oct_2025.change_million=1;assert(!auditPlannerChangeWindows(x,b,sources).valid);
 const y=copy();y.countries[1].active_people_change=100;assert(!auditPlannerChangeWindows(y,b,sources).valid);
 const z=copy();z.windows[0].fixed_person_panel=true;assert(!auditPlannerChangeWindows(z,b,sources).valid);
});

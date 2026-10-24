import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Source-backed country figures are late-2025 ad planner measurements, not active users',async()=>{
 const [study,dossier]=await Promise.all([load('ontology/youtube/country-ad-reach-comparisons.json'),load('specimens/youtube.json')]);
 const ids=new Set(dossier.evidence.map(x=>x.id));
 const actual=study.observations.map(x=>[x.code,x.ad_reach_million,x.reported_end_2024_to_2025_change_million,x.reported_july_to_oct_2025_change_million]);
 assert.deepEqual(actual,[['IN',500,9,-9],['ID',151,8,6],['JP',78.5,-0.2,3.1],['PH',59.6,1.9,1.8]]);
 assert(study.observations.every(x=>ids.has(x.source_id)&&x.observation==='2025-10'&&x.unique_mau===null&&x.unique_dau===null&&x.real_audience_growth===null&&x.creator_income===null));
 assert(Object.values(study.unmeasured).every(x=>x===null));
});

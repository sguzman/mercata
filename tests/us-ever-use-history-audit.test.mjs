import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditUsEverUseHistory} from '../site/us-ever-use-history-audit.mjs';
const load=async p=>JSON.parse(await fs.readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Pew historical U.S. survey observations preserve values, modes and missing years',async()=>{
 const [data,spec]=await Promise.all([load('ontology/youtube/audience-population-crosswalk.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditUsEverUseHistory(data,new Set(spec.evidence.map(s=>s.id))),{valid:true,errors:[]});
 assert.deepEqual(data.us_adult_ever_use_history.year_values.map(x=>x.percent),[73,73,81,83,85,84,84]);
});
test('Neither global active people nor old survey margins are invented',async()=>{
 const [data,spec]=await Promise.all([load('ontology/youtube/audience-population-crosswalk.json'),load('specimens/youtube.json')]);
 const known=new Set(spec.evidence.map(s=>s.id)),copy=()=>structuredClone(data);
 const a=copy();a.us_adult_ever_use_history.global_mau=100;assert(!auditUsEverUseHistory(a,known).valid);
 const b=copy();b.us_adult_ever_use_history.year_values[0].whole_sample_margin_pp=1.8;assert(!auditUsEverUseHistory(b,known).valid);
 const c=copy();c.us_adult_ever_use_history.missing_years=[];assert(!auditUsEverUseHistory(c,known).valid);
});

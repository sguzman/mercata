import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditLocalizationDecisions} from '../site/multilingual-decision-audit.mjs';
const load=async path=>JSON.parse(await fs.readFile(new URL('../'+path,import.meta.url),'utf8'));
test('Multilingual decision matrix preserves creator controls and single-video architectures',async()=>{
 const [model,specimen]=await Promise.all([load('ontology/youtube/multilingual-distribution.json'),load('specimens/youtube.json')]);
 const evidence=new Set(specimen.evidence.map(x=>x.id));
 assert.deepEqual(auditLocalizationDecisions(model,evidence),{valid:true,errors:[]});
 assert.equal(model.localization_choices.length,6);
 assert.equal(model.publication_architectures.length,2);
 assert(model.localization_choices.every(x=>x.measured_engagement_effect===null&&x.default_cost===null));
});
test('Reject unsupported multilingual profit, thumbnails on every format, and conflated channels',async()=>{
 const [model,specimen]=await Promise.all([load('ontology/youtube/multilingual-distribution.json'),load('specimens/youtube.json')]);const evidence=new Set(specimen.evidence.map(x=>x.id)),copy=()=>structuredClone(model);
 const m=copy();m.publication_architectures[0].creator_profit=100;assert(!auditLocalizationDecisions(m,evidence).valid);
 const s=copy();s.publication_architectures[1].supported_documented=true;assert(!auditLocalizationDecisions(s,evidence).valid);
 const t=copy();t.localization_choices.find(x=>x.id==='localized_visual_presentation').delivery_unit='localized_thumbnail_all_shorts';assert(!auditLocalizationDecisions(t,evidence).valid);
 const a=copy();a.localization_choices.find(x=>x.id==='human_dub').source_ids=['nonexistent'];assert(!auditLocalizationDecisions(a,evidence).valid);
});

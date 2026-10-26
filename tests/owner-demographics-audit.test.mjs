import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditOwnerDemographicSuppression} from '../site/owner-demographics-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Owner demographic API dimensions and withheld rows are not public unique-viewer counts',async()=>{
 const [model,dossier]=await Promise.all([load('ontology/youtube/viewer-person-metrics.json'),load('specimens/youtube.json')]);
 const sources=new Set(dossier.evidence.map(x=>x.id)),m=model.owner_demographic_suppression;
 assert.deepEqual(auditOwnerDemographicSuppression(model,sources),{valid:true,errors:[]});
 assert.equal(model.measures.length,8);
 assert.equal(m.precise_public_suppression_threshold,null);
 assert.equal(m.survey_nonresponse_rate,null);
 assert.equal(m.dimension_definitions[0].scope,'logged_in_users_associated_with_authorized_report');
 assert.deepEqual(m.dimension_definitions[1].api_values,['female','male','user_specified']);
 assert.equal(m.geography_revenue_same_privacy_threshold_applies,false);
 assert(dossier.claims.some(x=>x.id==='youtube-analytics-2026-private-demographic-suppression-bounds'&&x.source_ids.every(id=>sources.has(id))));
});
test('Owner demographics audit blocks invented suppressed people, a zero reading, or survey response rate',async()=>{
 const [model,dossier]=await Promise.all([load('ontology/youtube/viewer-person-metrics.json'),load('specimens/youtube.json')]);
 const sources=new Set(dossier.evidence.map(x=>x.id));
 const a=structuredClone(model);a.owner_demographic_suppression.suppression_conditions[0].threshold_n=50;
 assert(auditOwnerDemographicSuppression(a,sources).errors.includes('invented demographic suppression threshold or observed count'));
 const b=structuredClone(model);b.owner_demographic_suppression.unknown_row_assumed_zero=true;
 assert(auditOwnerDemographicSuppression(b,sources).errors.includes('missing demographics converted into observed people or survey response'));
 const c=structuredClone(model);c.owner_demographic_suppression.survey_nonresponse_rate=0.31;
 assert(auditOwnerDemographicSuppression(c,sources).errors.includes('missing demographics converted into observed people or survey response'));
});

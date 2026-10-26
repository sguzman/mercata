import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditRecommendationEvidence} from '../site/recommendation-evidence-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Official recommendation surfaces have citations, no synthetic ranks or earnings',async()=>{
 const [data,dossier]=await Promise.all([load('ontology/youtube/recommendation-surface-evidence.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditRecommendationEvidence(data,new Set(dossier.evidence.map(x=>x.id))),{valid:true,errors:[]});
});
test('Fabricated coefficients and first-year reach violate the research boundary',async()=>{
 const [data,dossier]=await Promise.all([load('ontology/youtube/recommendation-surface-evidence.json'),load('specimens/youtube.json')]);
 data.surfaces[0].ranking_weight=0.8;
 data.unmeasured.first_year_new_channel_reach=80;
 const errors=auditRecommendationEvidence(data,new Set(dossier.evidence.map(x=>x.id))).errors;
 assert(errors.includes('invented effect'));assert(errors.includes('invented ranking weights'));
});

test('Custom Feeds stays limited to eligible U.S. English signed-in accounts with no creator traffic estimate',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/recommendation-surface-evidence.json'),load('specimens/youtube.json')]);
 const c=m.custom_feed_availability,ids=new Set(d.evidence.map(x=>x.id));
 assert.equal(m.surfaces.length,6);
 assert(ids.has(c.announcement_source_id));
 assert(ids.has(c.help_source_id));
 assert.equal(c.announcement_date,'2026-09-23');
 assert.equal(c.documented_eligible_country,'US');
 assert.equal(c.documented_device_language,'en');
 assert.equal(c.watch_history_on_required,true);
 assert.equal(c.inactive_expiration_days,30);
 assert.equal(c.feeds_private_to_account,true);
 assert.equal(c.all_countries_available,false);
 assert.equal(c.actual_participating_viewer_count,null);
 assert.equal(c.measured_creator_referral_lift,null);
 assert.deepEqual(auditRecommendationEvidence(m,ids),{valid:true,errors:[]});
 m.custom_feed_availability.all_countries_available=true;
 assert(auditRecommendationEvidence(m,ids).errors.includes('Custom Feeds falsely generalized to global access or measured reach'));
});

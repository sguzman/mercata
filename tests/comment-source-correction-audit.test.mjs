import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditCommentSourceCorrection} from '../site/comment-source-correction-audit.mjs';
const load=async p=>JSON.parse(await fs.readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Primary manuscript controls toxicity direction despite contradicting repository abstract',async()=>{
 const [r,n,d]=await Promise.all(['ontology/youtube/comment-source-reconciliation-2026.json','ontology/youtube/comment-norms-evidence.json','specimens/youtube.json'].map(load));
 assert.deepEqual(auditCommentSourceCorrection(r,n,d),{valid:true,errors:[]});
 assert.equal(n.studies[0].observations[1].direction,'more_pronounced_among_prolific_commenters');
 assert.equal(r.political_sample.observed_channel_count,2940);
 assert.equal(r.climate_sample.selected_video_count,129);
 assert(r.political_sample.source_variant_conflict_disclosed);
});
test('Reconciliation rejects the reversed direction, false comment counts and invented causal impact',async()=>{
 const [r,n,d]=await Promise.all(['ontology/youtube/comment-source-reconciliation-2026.json','ontology/youtube/comment-norms-evidence.json','specimens/youtube.json'].map(load));
 const a=structuredClone(n);a.studies[0].observations[1].direction='more_pronounced_among_infrequent_commenters';assert(!auditCommentSourceCorrection(r,a,d).valid);
 const b=structuredClone(r);b.political_sample.observed_channel_count=3000;assert(!auditCommentSourceCorrection(b,n,d).valid);
 const c=structuredClone(r);c.climate_sample.causal_effect_of_replying=0.2;assert(!auditCommentSourceCorrection(c,n,d).valid);
});

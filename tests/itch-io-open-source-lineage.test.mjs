import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('2025 and 2026 open-source corpora share provenance, not additive paid seller samples',()=>{
 const x=read('ontology/itch-io/open-source-reproducibility-lineage-2025-2026.json');
 const d=read('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(y=>y.id===id)));
 assert.equal(x.study_2025.candidate_projects,765);
 assert.equal(x.study_2025.manually_retained_projects,613);
 assert.equal(x.study_2026.initial_prior_corpus,10548);
 assert.equal(x.study_2026.analyzed_projects,491);
 assert.equal(x.relation.shared_upstream_game_metadata,true);
 assert.equal(x.relation.counts_additive,false);
 assert.equal(x.relation.known_game_identity_intersection,null);
 assert.equal(x.relation.active_paid_seller_estimate,null);
 assert.equal(x.relation.development_profit_estimate,null);
});

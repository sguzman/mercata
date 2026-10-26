import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Multi-store rights acceptance follows public non-exclusive platform terms',()=>{
 const x=get('ontology/itch-io/multistore-rights-external-keys-2026.json');
 const p=get('plans/itch-io.json'),d=get('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.equal(x.itch_content_ownership.operator_license_exclusive,false);
 assert.equal(x.outside_distribution.prohibited_by_itch_blanket_exclusivity,false);
 assert.equal(x.outside_distribution.permission_to_sublicense_third_party_assets,null);
 assert.equal(x.outside_distribution.other_marketplace_signed_exclusivity_clause,null);
 const t=p.detail_tasks.find(t=>t.id==='itch-io/rights/check-multi-store-distribution-rights');
 assert.equal(t.percent,100);assert.equal(t.status,'complete');
 assert(t.evidence.includes('ontology/itch-io/multistore-rights-external-keys-2026.md'));
 assert(t.evidence.includes('tests/itch-io-multistore-rights.test.mjs'));
});
test('External-key entitlement and publisher DRM do not become purchases or certified offline builds',()=>{
 const x=get('ontology/itch-io/multistore-rights-external-keys-2026.json');
 assert.equal(x.external_key_route.key_only_standard_listing_supported,false);
 assert.equal(x.external_key_route.bundle_key_distribution_not_guaranteed,true);
 assert.equal(x.drm_and_play.itch_adds_drm_to_uploaded_file,false);
 assert.equal(x.drm_and_play.publisher_submitted_binary_contains_drm,null);
 assert.equal(x.drm_and_play.offline_executable_tested,null);
 assert.equal(x.unknown.duplicate_cross_store_buyer_fraction,null);
});

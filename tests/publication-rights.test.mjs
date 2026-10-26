import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditPublicationRights} from '../scripts/publication-rights.mjs';
const read=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));

test('Actual YouTube sources and claims have attributable review metadata; no blanket license clearance',async()=>{
 const [d,policy]=await Promise.all([read('specimens/youtube.json'),read('ontology/youtube/publication-rights.json')]);
 const result=auditPublicationRights(d.evidence,d.claims,policy);
 assert.equal(result.metadata_valid,true,JSON.stringify(result.errors));
 assert.equal(result.source_references,d.evidence.length);
 assert.equal(result.attributed_claims,d.claims.length);
 assert.equal(result.registered_third_party_assets,0);
 assert.equal(result.release_cleared,false);
 assert.equal(result.requires_manual_review,true);
 assert.equal(policy.manual_repository_review.completed,false);
 assert.equal(policy.automated_media_file_inventory.observed_repo_tree_entries,723);
 assert.equal(policy.automated_media_file_inventory.observed_repo_file_blobs,709);
 assert.deepEqual(policy.automated_media_file_inventory.observed_local_files,['assets/favicon.svg','assets/swatch.svg']);
 assert.equal(policy.automated_media_file_inventory.inspected_asset_markup.packaged_external_fonts_found,false);
 assert.equal(policy.automated_media_file_inventory.inspected_asset_markup.outside_assets_authorship_certified,false);
 assert.equal(policy.source_metadata_snapshot.registered_public_source_records,371);
 assert.equal(policy.source_metadata_snapshot.registered_public_claim_records,465);
 assert.equal(policy.source_metadata_snapshot.sources_with_https_url_publisher_title_retrieval_date_and_reuse_note,371);
 assert.equal(policy.source_metadata_snapshot.source_link_or_reuse_note_is_legal_permission,false);
 assert.equal(policy.source_metadata_snapshot.full_source_text_and_figure_rights_review_completed,false);
 assert.equal(policy.open_questions.repository_rights_clearance,null);
});
const sources=[{id:'research',url:'https://example.org/research',title:'Research',publisher:'Publisher',
 license:'Linked short paraphrase, not a permission statement',retrieved_at:'2026-10-24'}];
const claims=[{id:'fact',source_ids:['research'],limitations:'Only defined respondents'}];
const policy={third_party_asset_manifest:[],manual_repository_review:{completed:false,checked_all_media_files:false,checked_quoted_text:false}};
test('Publication rights metadata catches unsourced claims and missing source permission notes',()=>{
 const badSources=sources.map(x=>({...x,license:''}));
 const badClaims=[{id:'unsourced',source_ids:['missing'],limitations:''}];
 const result=auditPublicationRights(badSources,badClaims,policy);
 assert.equal(result.metadata_valid,false);
 assert(result.errors.some(e=>e.includes('source license')));
 assert(result.errors.some(e=>e.includes('Missing cited source')));
 assert(result.errors.some(e=>e.includes('scope/limitations')));
});
test('Third-party copy cannot be cleared from a citation alone',()=>{
 const copied={path:'site/example.svg',rights_basis:'externally_licensed',source_id:'research',
  review_confirmed:false,licensor:'Publisher',source_url:'https://example.org/research',
  license_or_permission_note:'Unsure whether embedding image is licensed'};
 const result=auditPublicationRights(sources,claims,{...policy,third_party_asset_manifest:[copied]});
 assert.equal(result.metadata_valid,false);
 assert(result.errors.some(e=>e.includes('Unreviewed third-party asset')));
 assert(result.errors.some(e=>e.includes('actual license URL')));
});
test('Even a complete third-party media entry requires manual repository review to claim clearance',()=>{
 const asset={path:'site/illustration.svg',rights_basis:'externally_licensed',source_id:'research',
  review_confirmed:true,licensor:'Example licensor',source_url:'https://example.org/image',
  license_or_permission_note:'Example grant, independently checked',license_url:'https://creativecommons.org/licenses/by/4.0/'};
 const doc={...policy,third_party_asset_manifest:[asset]};
 const result=auditPublicationRights(sources,claims,doc);
 assert.equal(result.metadata_valid,true,JSON.stringify(result.errors));
 assert.equal(result.registered_third_party_assets,1);
 assert.equal(result.release_cleared,false);
});

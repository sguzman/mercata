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

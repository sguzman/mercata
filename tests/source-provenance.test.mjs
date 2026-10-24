import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditPublicSources,canonicalSourceUrl} from '../scripts/source-provenance.mjs';
const load=async path=>JSON.parse(await readFile(new URL('../'+path,import.meta.url),'utf8'));

test('All duplicate-document URLs and syndicated survey sources are independently recorded',async()=>{
 const [dossier,registry]=await Promise.all([
   load('specimens/youtube.json'),load('ontology/youtube/source-families.json')
 ]);
 const result=auditPublicSources(dossier.evidence,dossier.claims,registry);
 assert.equal(result.source_references,dossier.evidence.length);
 assert.equal(result.claims,dossier.claims.length);
 assert.equal(result.duplicate_document_families.length,7);
 assert.equal(result.registered_shared_source_families,8);
 assert.equal(result.unregistered_duplicate_documents.length,0);
 assert.equal(result.invalid_source_family_records.length,0);
 assert.equal(result.missing_claim_sources.length,0);
 assert.equal(result.missing_retrieval_dates.length,0);
 assert.equal(result.inferred_independent_studies,null);
});
test('Normalization recognizes help-page locales without merging different research',()=>{
 assert.equal(canonicalSourceUrl('https://support.google.com/youtube/answer/72851?hl=en'),
   canonicalSourceUrl('https://support.google.com/youtube/answer/72851?hl=es'));
 assert.notEqual(canonicalSourceUrl('https://example.org/research/a'),
   canonicalSourceUrl('https://example.org/research/b'));
});
test('Source identity preserves country selectors, report editions, and query order',()=>{
 assert.notEqual(canonicalSourceUrl('https://support.google.com/youtube/answer/9385307?co=GENIE.CountryCode%3DMX&hl=en'),
   canonicalSourceUrl('https://support.google.com/youtube/answer/9385307?co=GENIE.CountryCode%3DUS&hl=en'));
 assert.notEqual(canonicalSourceUrl('https://example.org/report?year=2025'),
   canonicalSourceUrl('https://example.org/report?year=2026'));
 assert.equal(canonicalSourceUrl('https://example.org/report?year=2026&co=MX'),
   canonicalSourceUrl('https://example.org/report?co=MX&year=2026'));
 assert.equal(canonicalSourceUrl('https://example.org/report?year=2026&utm_source=mail#figure'),
   canonicalSourceUrl('https://example.org/report?year=2026'));
 assert.equal(canonicalSourceUrl('http://example.org/report'),'');
 assert.equal(canonicalSourceUrl('not a URL'),'');
 const src=[
   {id:'a',url:'https://example.org/report?year=2025',publisher:'Publisher',published_at:null,retrieved_at:'2026-10-23'},
   {id:'b',url:'https://example.org/report?year=2026',publisher:'Publisher',published_at:null,retrieved_at:'2026-10-23'}
 ];
 const audit=auditPublicSources(src,[{id:'report2025',source_ids:['a']},{id:'report2026',source_ids:['b']}],{families:[]});
 assert.equal(audit.distinct_normalized_urls,2);
 assert.equal(audit.unregistered_duplicate_documents.length,0);
});

test('Unregistered shared URLs are rejected while unknown source date is allowed',()=>{
 const src=[
  {id:'a',url:'https://example.org/post?hl=en',publisher:'Publisher',published_at:null,retrieved_at:'2026-10-23'},
  {id:'b',url:'https://example.org/post?hl=es',publisher:'Publisher',published_at:null,retrieved_at:'2026-10-23'}
 ];
 const claims=[{id:'one',source_ids:['a']}];
 const result=auditPublicSources(src,claims,{families:[]});
 assert.equal(result.unregistered_duplicate_documents.length,1);
 assert.equal(result.undated_publication_references,2);
 assert.equal(result.missing_claim_sources.length,0);
});

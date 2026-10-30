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
 assert.equal(result.registered_shared_source_families,registry.families.length);
 assert(result.registered_shared_source_families>=9,'Known shared source families must remain registered');
 assert(registry.families.some(x=>x.id==='agentio-creator-playbook-syndication' && x.relation==='same_underlying_survey_different_urls'),
   'Repeated vendor observations and their secondary reporting must retain one shared study family');
 assert(result.duplicate_document_families.length<result.registered_shared_source_families,'Shared respondent datasets may span different URLs');
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


test('Successive same-title financial snapshots remain one source family without becoming duplicate documents',()=>{
 const evidence=[
  {id:'initial',url:'https://example.org/report/initial',publisher:'Author',retrieved_at:'2026-10-29',published_at:null},
  {id:'followup',url:'https://example.org/report/followup',publisher:'Author',retrieved_at:'2026-10-29',published_at:null}
 ];
 const family={id:'one-game-two-checkpoints',source_ids:['initial','followup'],relation:'same_title_nested_cumulative_observations'};
 const audit=auditPublicSources(evidence,[{id:'a',source_ids:['initial']},{id:'b',source_ids:['followup']}],{families:[family]});
 assert.equal(audit.invalid_source_family_records.length,0);
 assert.equal(audit.registered_shared_source_families,1);
 assert.equal(audit.inferred_independent_studies,null);
 const bad=auditPublicSources(evidence,[],{families:[{...family,relation:'unknown_untrusted_relation'}]});
 assert.deepEqual(bad.invalid_source_family_records,['one-game-two-checkpoints']);
});

test('Independent URL versions of one vendor report may be grouped without asserting one common dataset',()=>{
 const sources=[{id:'a',url:'https://example.org/operator/post',publisher:'Operator',retrieved_at:'2026-10-29'},
 {id:'b',url:'https://example.org/operator/revised',publisher:'Operator',retrieved_at:'2026-10-29'}];
 const f={id:'synthetic-operator-revisions',relation:'same_vendor_conflicting_report_versions',source_ids:['a','b']};
 const a=auditPublicSources(sources,[{id:'claim',source_ids:['a','b']}],{families:[f]});
 assert.equal(a.invalid_source_family_records.length,0);
 assert.equal(a.unregistered_duplicate_documents.length,0);
 assert.equal(a.inferred_independent_studies,null);
 const b=auditPublicSources(sources,[],{families:[{...f,relation:'unregistered_vendor' }]});
 assert.equal(b.invalid_source_family_records.length,1);
});

test('Canonical URLs ignore Reddit title slugs and clients but distinguish individual comments',()=>{
 const post='https://www.reddit.com/r/gamedev/comments/1r5jv4q/first_title/';
 assert.equal(canonicalSourceUrl(post),
  canonicalSourceUrl('https://old.reddit.com/r/gamedev/comments/1r5jv4q/another_title'));
 assert.equal(canonicalSourceUrl(post),
  canonicalSourceUrl('https://redd.it/1r5jv4q?utm_source=share'));
 assert.equal(canonicalSourceUrl(post),
  canonicalSourceUrl('https://new.reddit.com/comments/1r5jv4q'));
 assert.notEqual(canonicalSourceUrl(post),
  canonicalSourceUrl('https://www.reddit.com/r/gamedev/comments/1r5jv4q/first_title/abc123/'));
 assert.notEqual(
  canonicalSourceUrl('https://www.reddit.com/r/gamedev/comments/1r5jv4q/title/abc123/'),
  canonicalSourceUrl('https://www.reddit.com/r/gamedev/comments/1r5jv4q/title/def456/'));
});
test('Steam AppID is stable across title slugs but country-specific prices remain distinct',()=>{
 const plain='https://store.steampowered.com/app/4230140/';
 assert.equal(canonicalSourceUrl(plain),
  canonicalSourceUrl('https://store.steampowered.com/app/4230140/In__Out/?l=english#description'));
 assert.notEqual(canonicalSourceUrl(plain),
  canonicalSourceUrl('https://store.steampowered.com/app/4230141'));
 assert.notEqual(canonicalSourceUrl(plain),
  canonicalSourceUrl('https://store.steampowered.com/app/4230140/?cc=MX'));
 assert.notEqual(canonicalSourceUrl('https://store.steampowered.com/app/4230140/?cc=MX'),
  canonicalSourceUrl('https://store.steampowered.com/app/4230140/?cc=US'));
});
test('Reused Reddit post identifiers are detected even when titles or hosts change',()=>{
 const evidence=[
  {id:'first',url:'https://www.reddit.com/r/gamedev/comments/1r5jv4q/example/',publisher:'Author',retrieved_at:'2026-10-30'},
  {id:'copy',url:'https://old.reddit.com/r/gamedev/comments/1r5jv4q/rewritten-title/',publisher:'Author',retrieved_at:'2026-10-30'}
 ];
 const audit=auditPublicSources(evidence,[{id:'a',source_ids:['first']}],{families:[]});
 assert.equal(audit.unregistered_duplicate_documents.length,1);
 assert.deepEqual(audit.unregistered_duplicate_documents[0].source_ids,['copy','first']);
});

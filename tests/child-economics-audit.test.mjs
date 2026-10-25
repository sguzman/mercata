import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditChildMonetization} from '../site/child-economics-audit.mjs';
const load=async path=>JSON.parse(await fs.readFile(new URL('../'+path,import.meta.url),'utf8'));
test('All 16 creator earning paths maintain video, channel and outside transaction distinctions',async()=>{
 const [model,child,eligible,revenue,record]=await Promise.all(['ontology/youtube/child-directed-economics-2026.json','ontology/youtube/child-age-and-format-gates.json','ontology/youtube/eligibility-matrix.json','ontology/youtube/revenue-pathways.json','specimens/youtube.json'].map(load));
 assert.deepEqual(auditChildMonetization(model,child,eligible,revenue,new Set(record.evidence.map(s=>s.id))),{valid:true,errors:[]});
 assert.equal(model.pathways.find(x=>x.id==='watch-page-ads').assessment,'contextual_ads_may_remain');
 assert.equal(model.pathways.find(x=>x.id==='live-gifts').official_scope,'stream');
 assert.equal(model.pathways.find(x=>x.id==='direct-sponsorship').official_scope,'external_transaction');
 assert(model.pathways.every(x=>x.median_earnings===null));
});
test('Children policy audit rejects false ad bans, unsupported profits, and classifying all animation as child directed',async()=>{
 const [data,child,eligible,revenue,record]=await Promise.all(['ontology/youtube/child-directed-economics-2026.json','ontology/youtube/child-age-and-format-gates.json','ontology/youtube/eligibility-matrix.json','ontology/youtube/revenue-pathways.json','specimens/youtube.json'].map(load));const ids=new Set(record.evidence.map(x=>x.id)),copy=()=>structuredClone(data);
 const ad=copy();ad.feature_restrictions.all_advertising_banned=true;assert(!auditChildMonetization(ad,child,eligible,revenue,ids).valid);
 const profit=copy();profit.pathways[0].median_earnings=123;assert(!auditChildMonetization(profit,child,eligible,revenue,ids).valid);
 const kid=copy();kid.classification_rules.find(x=>x.case==='general_family_friendly').economic_handling='apply_restrictions';assert(!auditChildMonetization(kid,child,eligible,revenue,ids).valid);
});

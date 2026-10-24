import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditCheckoutRefunds} from '../site/checkout-refund-audit.mjs';
const load=async path=>JSON.parse(await readFile(new URL('../'+path,import.meta.url),'utf8'));
test('Membership, Supers and retail checkout sources retain price/owner boundaries',async()=>{
 const [study,dossier]=await Promise.all([load('ontology/youtube/checkout-refund-evidence.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditCheckoutRefunds(study,new Set(dossier.evidence.map(x=>x.id))),{valid:true,errors:[]});
 assert.equal(study.published_membership_price_examples.observed_creator_price_count,0);
});
test('Validator rejects false merchant checkout and invented sample prices',async()=>{
 const [study,dossier]=await Promise.all([load('ontology/youtube/checkout-refund-evidence.json'),load('specimens/youtube.json')]);
 const altered=structuredClone(study);altered.products.find(x=>x.id==='external_shopping').checkout_owner='youtube';
 altered.products[0].median_buyer_price=9.99;
 altered.published_membership_price_examples.observed_creator_price_count=120;
 const checked=auditCheckoutRefunds(altered,new Set(dossier.evidence.map(x=>x.id)));
 assert.equal(checked.valid,false);
 assert(checked.errors.includes('false merchant responsibility'));
 assert(checked.errors.some(x=>x.includes('unobserved seller metric')));
 assert(checked.errors.includes('false creator price sample'));
});

import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditAdvertiserRevisions} from '../site/advertiser-revision-audit.mjs';
const load=async f=>JSON.parse(await fs.readFile(new URL('../'+f,import.meta.url),'utf8'));
test('Six sourced month-level advertiser revisions retain separate content and YPP gates',async()=>{
 const [history,dossier]=await Promise.all([load('ontology/youtube/advertiser-policy-history.json'),load('specimens/youtube.json')]);
 const known=new Set(dossier.evidence.map(x=>x.id));
 assert.deepEqual(auditAdvertiserRevisions(history,known),{valid:true,errors:[],count:6});
 assert.equal(history.revisions.find(x=>x.id==='2026-september-game-violence').effective_day,null);
 assert(Object.values(history.uncertainty).every(x=>x===null));
});
test('Policy audit rejects invented effective day, invented earnings and unsourced updates',async()=>{
 const [h,d]=await Promise.all([load('ontology/youtube/advertiser-policy-history.json'),load('specimens/youtube.json')]);
 const k=new Set(d.evidence.map(x=>x.id)),copy=()=>structuredClone(h);
 const a=copy();a.revisions[0].effective_day='2026-10-01';assert(!auditAdvertiserRevisions(a,k).valid);
 const b=copy();b.uncertainty.measured_income_uplift=10;assert(!auditAdvertiserRevisions(b,k).valid);
 const c=copy();c.revisions[1].source_ids=['invalid'];assert(!auditAdvertiserRevisions(c,k).valid);
 const e=copy();e.review_mechanism.review_guarantees_monetization=true;assert(!auditAdvertiserRevisions(e,k).valid);
});

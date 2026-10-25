import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {auditCreatorPortability} from '../site/creator-portability-audit.mjs';
const load=async x=>JSON.parse(await fs.readFile(new URL('../'+x,import.meta.url),'utf8'));
test('Video copying, customer CSVs, and subscriber migration are distinct',async()=>{
 const [x,d]=await Promise.all([load('ontology/youtube/cross-platform-portability-2026.json'),load('specimens/youtube.json')]);
 const known=new Set(d.evidence.map(s=>s.id));
 assert.deepEqual(auditCreatorPortability(x,known),{valid:true,errors:[]});
 assert.deepEqual(x.routes.map(r=>r.platform),['youtube','twitch','tiktok','vimeo_ott']);
 assert.equal(x.routes[1].retention_days_by_tier.affiliate,14);
 assert.equal(x.routes[1].retention_days_by_tier.non_affiliate,7);
 assert.equal(x.routes[1].retention_days_by_tier.partner_or_prime_or_turbo,60);
 assert.equal(x.routes[3].authorized_customer_csv_possible,true);
 assert(x.routes.every(r=>r.native_follower_or_subscriber_transfer_verified===null));
 assert(Object.values(x.unmeasured).every(v=>v===null));
});
test('Portability audit rejects invented rates and missing consent',async()=>{
 const [x,d]=await Promise.all([load('ontology/youtube/cross-platform-portability-2026.json'),load('specimens/youtube.json')]);const ids=new Set(d.evidence.map(s=>s.id)),copy=()=>structuredClone(x);
 const m=copy();m.routes[0].native_follower_or_subscriber_transfer_verified=true;assert(!auditCreatorPortability(m,ids).valid);
 const n=copy();n.routes[3].restrictions=[];assert(!auditCreatorPortability(n,ids).valid);
 const p=copy();p.routes[1].retention_days_by_tier.affiliate=60;assert(!auditCreatorPortability(p,ids).valid);
});

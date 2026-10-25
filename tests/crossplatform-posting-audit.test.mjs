import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditCrossplatformStudy} from '../site/crossplatform-posting-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Published multi-posting aggregates are bounded, and historical paper is distinct',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/crossplatform-posting-evidence.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditCrossplatformStudy(m,new Set(d.evidence.map(x=>x.id))),{valid:true,errors:[]});
 assert.equal(m.vendor_posting_snapshot.successful_post_events>m.vendor_posting_snapshot.uploads,true);
});
test('No user migration or causal uplift can be inferred from duplicate uploads',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/crossplatform-posting-evidence.json'),load('specimens/youtube.json')]);
 m.vendor_posting_snapshot.measured_cross_platform_follower_migration=0.76;
 m.unmeasured.causal_crosspost_net_profit=1000;
 m.historical_competition_paper.causal_transport_to_2026_shorts_verified=true;
 const result=auditCrossplatformStudy(m,new Set(d.evidence.map(x=>x.id)));
 assert.equal(result.valid,false);
 for(const msg of ['fabricated migrating viewers','invented migration rate or profit','false historical causal transport'])assert(result.errors.includes(msg));
});

import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=get('ontology/steam/keys-cross-store-and-ai-disclosure-2026.json'),d=get('specimens/steam.json'),p=get('plans/steam.json'),q=get('queues/steam.json');
test('Key types and timing are not misrepresented as Steam checkout orders',()=>{
 assert.equal(x.steam_keys.default_release_initial_threshold_keys,5000);
 assert.equal(x.steam_keys.beta_pre_release_generally_limit_keys,2500);
 assert.equal(x.steam_keys.first_studio_wait_days_from_appid_creation,21);
 assert.equal(x.steam_keys.beta_keys_may_be_sold,false);
 assert.equal(x.steam_keys.retail_activations_are_steam_store_paid_orders,false);
 assert.equal(x.unknown.actual_key_activations,null);
});
test('AI disclosures do not imply approval or copyright rights',()=>{
 assert.deepEqual(x.content_survey.sections,['general','mature','generative_ai']);
 assert.equal(x.content_survey.live_generated_guardrails_explanation,true);
 assert.equal(x.content_survey.acceptance_guaranteed,false);
 assert.equal(x.content_survey.confers_asset_copyright,false);
 assert.equal(x.unknown.asset_license_chain,null);
});
test('Public claims are traceable and task count preserved',()=>{
 const ss=new Set(d.evidence.map(e=>e.id));
 assert.equal(x.claim_ids.length,16);assert.equal(x.source_ids.length,3);
 for(const id of x.source_ids)assert(ss.has(id),id);
 for(const id of x.claim_ids){const c=d.claims.find(c=>c.id===id);assert(c,id);assert(c.source_ids.every(s=>ss.has(s)));}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
 assert.equal(x.no_key_material_obtained,true);
});

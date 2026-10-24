import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {assessProductionLedger,auditVideoProductionCosts} from '../site/video-production-cost-audit.mjs';
const load=async x=>JSON.parse(await readFile(new URL('../'+x,import.meta.url),'utf8'));
const synthetic={source:'authorized_creator_aggregate',currency:'USD',format:'short_phone',period:'synthetic_only',purchased_assets_allocated:0,existing_gear_allocated:2,software_and_licenses:0,network_and_energy:3,contractors:0,other_cash_costs:1,logged_labor_hours:4,verified_net_creator_receipts:null};
test('Production paths require sources and preserve unmeasured creator costs',async()=>{
 const [model,dossier]=await Promise.all([load('ontology/youtube/video-production-cost-register.json'),load('specimens/youtube.json')]);
 assert.deepEqual(auditVideoProductionCosts(model,new Set(dossier.evidence.map(x=>x.id))),{valid:true,errors:[]});
});
test('Unknown receipts are not falsely converted into zero profit',()=>{
 const x=assessProductionLedger(synthetic);assert.equal(x.total_cost,6);assert.equal(x.net_cash,null);assert.equal(x.net_cash_per_hour,null);
});
test('Synthetic cash scenario can show a loss and zero-hour rate remains unknown',()=>{
 const x=assessProductionLedger({...synthetic,verified_net_creator_receipts:2,logged_labor_hours:0});
 assert.equal(x.net_cash,-4);assert.equal(x.net_cash_per_hour,null);assert.equal(x.status,'descriptive_cash_return');
});
test('Rejects unsupported negative or missing expenses',()=>{
 assert.equal(assessProductionLedger({...synthetic,network_and_energy:-1}).status,'invalid');
 assert.equal(assessProductionLedger({...synthetic,source:'public_youtube_views'}).status,'invalid');
});

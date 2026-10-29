import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticSteamPortfolioIdentity as audit} from '../site/steam-portfolio-identity-guard.mjs';
const load=path=>JSON.parse(fs.readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const x=load('ontology/steam/steam-portfolio-labels-creator-homepages-and-payee-transfer-2026.json'),d=load('specimens/steam.json'),p=load('plans/steam.json'),q=load('queues/steam.json');
test('Shared names, creator homepages and franchises are different portfolio counts',()=>{
 const r=audit(x.synthetic_fixtures);
 assert.equal(r.synthetic_game_appids,3);assert.equal(r.distinct_display_developer_labels,3);
 assert.equal(r.distinct_display_publisher_labels,2);assert.equal(r.distinct_creator_homepages,2);
 assert.equal(r.distinct_franchise_pages,1);assert.equal(r.fixture_payee_identifiers,3);
 assert.equal(r.multiple_developer_label_apps,1);assert.equal(r.appid_with_multiple_payment_periods,1);
 assert.equal(r.legal_partner_count_inferred_from_names,false);
});
test('Transfer periods preserve AppID while avoiding double-paid overlap',()=>{
 const rows=structuredClone(x.synthetic_fixtures);
 rows[0].payment_periods[1].start_date='2025-12-01';
 assert.throws(()=>audit(rows),/Overlapping/);
 const disjoint=structuredClone(x.synthetic_fixtures);
 disjoint[0].payment_periods[1].start_date='2026-02-01';
 assert.equal(audit(disjoint).appid_with_multiple_payment_periods,1);
});
test('Reject real-looking identifiers, duplicate AppIDs, bad labels and impossible dates',()=>{
 assert.throws(()=>audit([{}]),/synthetic AppIDs/);
 assert.throws(()=>audit([...x.synthetic_fixtures,x.synthetic_fixtures[0]]),/Duplicate fixture/);
 const rows=structuredClone(x.synthetic_fixtures);
 rows[0].developer_labels.push(rows[0].developer_labels[0]);
 assert.throws(()=>audit(rows),/Duplicate developer_labels/);
 const badDate=structuredClone(x.synthetic_fixtures);
 badDate[0].payment_periods[0].start_date='2026-02-30';
 assert.throws(()=>audit(badDate),/Invalid synthetic ISO/);
 const badPayee=structuredClone(x.synthetic_fixtures);
 badPayee[0].payment_periods[0].fixture_partner_id='actual-company-id';
 assert.throws(()=>audit(badPayee),/Only synthetic/);
});
test('Nothing from public branding or synthetic history is actual publisher income',()=>{
 const r=audit(x.synthetic_fixtures);
 for(const k of ['actual_legal_publishers','actual_developer_headcount','actual_first_game_studios','actual_publisher_receipts_usd','actual_publisher_profit_usd'])assert.equal(r[k],null);
 assert.equal(x.documentary_rules.homepage_marketing_access_is_payment_right,false);
 assert(Object.values(x.unknown).every(v=>v===null));
});
test('New claim links are valid and 293 fixed research tasks remain intact',()=>{
 const sources=new Set(d.evidence.map(s=>s.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,4);assert.equal(x.claim_ids.length,13);
 for(const id of x.source_ids)assert(sources.has(id),id);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>sources.has(s)),id);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((s,v)=>s+v,0)/293));
 assert(p.detail_tasks.find(t=>t.id==='steam/competition/classify-portfolio-publishers').evidence.includes('ontology/steam/steam-portfolio-labels-creator-homepages-and-payee-transfer-2026.json'));
});

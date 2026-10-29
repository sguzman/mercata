import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSteamAuthorReportedNetStage as audit} from '../site/steam-author-net-stage-audit.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const doc=read('ontology/steam/steam-author-sim-firstgame-net-stage-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
const fixture=()=>({...doc.self_reported,released_date:doc.publication.released_date,post_date:doc.publication.post_date});
test('Developer two-week first-game figures remain author self-report, not bank cash',()=>{
 const r=audit(fixture());assert.equal(r.release_to_report_calendar_days,14);
 assert.equal(r.author_sold_units,820);assert.equal(r.author_returned_units,82);
 assert.equal(r.self_reported_returned_over_sold,0.1);
 assert.equal(r.actual_received_partner_usd_cents,null);assert.equal(r.publisher_profit_after_labor,null);
});
test('Reported net label exceeds simplified 70% gross, without inferring Steam remittance',()=>{
 const r=audit(fixture());assert.equal(r.author_gross_usd_cents,704700);
 assert.equal(r.author_net_label_usd_cents,581200);
 assert.equal(r.illustrative_gross_times_seventy_percent_cents,493290);
 assert.equal(r.author_net_label_exceeds_illustrative_seventy_percent,true);
 assert.equal(r.author_net_proven_to_be_after_platform_share,false);
 assert.equal(r.matched_wishlist_purchase_rate,null);
});
test('Contradictory values, unprovided proof and nonaggregate fields are rejected',()=>{
 const a=fixture();a.private_partner_key='secret';assert.throws(()=>audit(a),/Only public/);
 const b=fixture();b.copies_returned=821;assert.throws(()=>audit(b),/Contradictory/);
 const c=fixture();c.net_label_usd_cents=704701;assert.throws(()=>audit(c),/Contradictory/);
 const e=fixture();e.source_states_net_after_steam_cut=true;assert.throws(()=>audit(e),/Financial share/);
 const f=fixture();f.post_date='2026-08-44';assert.throws(()=>audit(f),/chronology/);
});
test('Six public linked claims and fixed 293 original Steam research tasks',()=>{
 const ids=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(doc.source_ids.length,1);assert.equal(doc.claim_ids.length,6);
 for(const s of doc.source_ids)assert(ids.has(s));
 for(const c of doc.claim_ids)assert(claims.has(c)&&claims.get(c).source_ids.every(s=>ids.has(s)));
 assert(Object.values(doc.unknown).every(x=>x===null));
 const v=[...p.detail_tasks.map(x=>x.percent),...q.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(v.length,293);assert.equal(p.progress_percent,Math.round(v.reduce((a,b)=>a+b,0)/293));
});

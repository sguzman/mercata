import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {compareSyntheticSteamReleaseYearCounters as audit} from '../site/steam-release-provider-frame-crosswalk.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/steam-2025-three-catalog-release-frame-divergence-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Public 2025 release-year counts disagree by 4,049 without identifying a true total',()=>{
 const r=audit(x.count_rows);assert.equal(r.release_year,2025);assert.equal(r.provider_count,3);
 assert.equal(r.minimum_reported_catalog_games,20565);assert.equal(r.maximum_reported_catalog_games,24614);
 assert.equal(r.spread_between_reported_counts,4049);
 assert.equal(r.span_is_statistical_confidence_interval,false);
 assert.equal(r.all_capture_dates_known_and_aligned,false);assert.equal(r.actual_historical_total_games,null);
});
test('A public game roster does not verify original paid release or publisher income',()=>{
 const r=audit(x.count_rows);
 for(const k of ['initial_paid_releases','actual_zero_paid_sales_share','legal_publisher_income'])assert.equal(r[k],null);
 assert.equal(r.original_paid_release_frame_attested,false);
});
test('Reject mismatched years, unsupported raw records, bad dates, missing sources and paid-frame overclaims',()=>{
 const f=()=>structuredClone(x.count_rows);
 const a=f();a[0].release_year=2024;assert.throws(()=>audit(a),/Incompatible release years/);
 const b=f();b[1].raw_appids=[123];assert.throws(()=>audit(b),/Public aggregate/);
 const c=f();c[0].catalog_counted_at='2026-10-30';assert.throws(()=>audit(c),/date/);
 const e=f();e[2].source_id=e[1].source_id;assert.throws(()=>audit(e),/Unique public source/);
 const g=f();g[0].original_paid_first_release_verified=true;assert.throws(()=>audit(g),/No matching/);
});
test('All new claims refer to registered public sources and fixed 293 Steam tasks',()=>{
 const sources=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(x.source_ids.length,3);assert.equal(x.claim_ids.length,5);
 for(const id of x.source_ids)assert(sources.has(id),id);
 for(const id of x.claim_ids)assert(claims.has(id)&&claims.get(id).source_ids.every(s=>sources.has(s)),id);
 assert(Object.values(x.unknown).every(v=>v===null));
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});

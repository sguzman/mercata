import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {compareReportingPeriods,sumNonoverlappingPeriods,inferCreatorPayFromAdRevenue} from '../site/alphabet-ad-revenue-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Alphabet 10-K and 10-Q YouTube ads revenue matches SEC reported accounting units',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/alphabet-youtube-ads-sec-2026.json'),load('specimens/youtube.json')]);
 assert(m.source_ids.every(id=>d.evidence.some(x=>x.id===id)));
 assert.equal(m.observations.length,7);
 assert.deepEqual(m.observations.slice(0,3).map(x=>x.value_usd_millions),[31510,36147,40367]);
 assert.deepEqual(m.observations.slice(3,5).map(x=>x.value_usd_millions),[9796,11055]);
 assert.deepEqual(m.observations.slice(5).map(x=>x.value_usd_millions),[18723,20938]);
 assert.equal(m.reported_currency,'USD');
 assert(Object.values(m.unknown).every(x=>x===null));
});
test('Matched windows compare year-over-year without combining H1 and Q2',async()=>{
 const m=await load('ontology/youtube/alphabet-youtube-ads-sec-2026.json');
 for(const [a,b] of m.growth_comparison_ids){
   const result=compareReportingPeriods(m,a,b);
   assert.equal(result.creator_payout,null);
   assert.equal(result.unique_people,null);
   assert(result.percent>0 && result.percent<30);
 }
 assert.throws(()=>compareReportingPeriods(m,'fy2025','h1-2026'),/Incompatible/);
 assert.throws(()=>compareReportingPeriods(m,'q2-2025','h1-2026'),/Incompatible/);
 assert.throws(()=>compareReportingPeriods(m,'q2-2026','q2-2025'),/Incompatible/);
 assert.throws(()=>sumNonoverlappingPeriods(m,['q2-2026','h1-2026']),/Overlapping/);
 assert.throws(()=>sumNonoverlappingPeriods(m,['fy2025','h1-2025']),/Overlapping/);
 assert.equal(sumNonoverlappingPeriods(m,['fy2024','fy2025']).amount_usd_millions,76514);
 assert.equal(inferCreatorPayFromAdRevenue(m).allowed,false);
});
test('Site presents annual and interim revenue without inventing creator earnings',async()=>{
 const site=await readFile(new URL('../site/app.js',import.meta.url),'utf8');
 assert(site.includes('renderAlphabetAdRevenue'));
 assert(site.includes('alphabet-youtube-ads-sec-2026.json'));
 assert(site.includes('not creator payouts'));
});

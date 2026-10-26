import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {auditPerAccountViewTime} from '../site/per-account-view-time-audit.mjs';
const load=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
test('Digital i account mean retains 20-market denominator apart from UK person devices',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/country-reach-devices.json'),load('specimens/youtube.json')]);
 const known=new Set(d.evidence.map(x=>x.id));
 assert.deepEqual(auditPerAccountViewTime(m,known),{valid:true,errors:[]});
 const frame=m.multi_market_daily_account_view_time;
 assert.deepEqual(frame.observations.map(x=>x.minutes_per_account_per_day),[87.2,99.1]);
 assert.equal(frame.representative_global_population,false);
 assert.equal(frame.heavy_viewer_threshold_minutes_per_day,null);
 assert.equal(m.observations.find(x=>x.id==='uk-youtube-online-minutes-2025').value,51);
 assert.equal(m.observations.find(x=>x.id==='uk-home-all-device-youtube-2025').value,41);
 assert(d.claims.some(c=>c.id==='digital-i-selected-20market-daily-youtube-per-account-2024-25'&&c.source_ids.includes(frame.source_id)));
});
test('Per-account view-time audit rejects invented typical person or silently pooled UK samples',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/country-reach-devices.json'),load('specimens/youtube.json')]);
 const known=new Set(d.evidence.map(x=>x.id));
 const a=structuredClone(m);a.multi_market_daily_account_view_time.raw_sampled_account_n=100000;
 assert(auditPerAccountViewTime(a,known).errors.includes('invented global person mean or heavy viewer distribution'));
 const b=structuredClone(m);b.multi_market_daily_account_view_time.comparability.comparable_to_uk_ofcom_2025_51_minutes=true;
 assert(auditPerAccountViewTime(b,known).errors.includes('incompatible units pooled or missing person counts fabricated'));
 const c=structuredClone(m);c.multi_market_daily_account_view_time.observations[1].unique_people=2000000;
 assert(auditPerAccountViewTime(c,known).errors.includes('wrong annual per-account measures or invented unique humans'));
});

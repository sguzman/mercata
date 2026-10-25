import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const load=async x=>JSON.parse(await readFile(new URL('../'+x,import.meta.url),'utf8'));
test('Monthly Patreon affiliate table adds to pooled YouTube sample without inventing native payouts',async()=>{
 const [m,d]=await Promise.all([load('ontology/youtube/patreon-earnings-timeframe-2026.json'),load('specimens/youtube.json')]);
 assert(m.source_ids.every(x=>d.evidence.some(s=>s.id===x)));
 assert.equal(m.youtube_affiliated_march_snapshots.reduce((s,x)=>s+x.n,0),23435);
 assert.equal(m.youtube_affiliated_pooled.observations,23435);
 assert.deepEqual(m.youtube_affiliated_march_snapshots.map(x=>x.median_usd),[44,53,43]);
 assert.equal(m.community_tail_qualitative.platforms_pooled,true);
 assert(Object.values(m.unmeasured).every(x=>x===null));
});
test('Patreon-only and external affiliate rows are not all YouTube monetary outcomes',async()=>{
 const m=await load('ontology/youtube/patreon-earnings-timeframe-2026.json');
 assert.deepEqual(m.march_2024_other_affiliations.map(x=>x.median_usd),[43,42,53,44,72,55]);
 assert.equal(m.youtube_affiliated_pooled.zero_income_creators_included,false);
 assert.equal(m.community_tail_qualitative.per_category_median_youtube_usd,null);
});

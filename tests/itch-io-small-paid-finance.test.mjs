import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Small games distinguish gross sales, bundle downloads, and full production cost',()=>{
 const d=load('ontology/itch-io/small-paid-release-finance-2022.json'),s=load('specimens/itch-io.json');
 assert(d.source_ids.every(id=>s.evidence.some(e=>e.id===id)));
 const fish=d.records.find(r=>r.id==='fish_and_feathers_playdate');
 assert.deepEqual([fish.reported_paid_game_sales,fish.reported_download_events,fish.reported_gross_usd],[127,369,401]);
 assert.equal(fish.paid_buyers_from_downloads_identifiable,false);
 assert.equal(fish.game_labor_adjusted_profit_usd,null);
 const other=d.records.find(r=>r.id==='escape_from_life_inc');
 assert.equal(other.exact_itch_only_receipts_usd,null);
 assert.equal(other.music_cash_cost_usd_low,300);
 assert.equal(other.final_developer_net_profit_usd,null);
 assert(Object.values(d.population_stats_not_observed).every(v=>v===null));
});

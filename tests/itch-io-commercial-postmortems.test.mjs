import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Store sales and game-development profit are separate in disclosed commercial cases',()=>{
 const data=get('ontology/itch-io/commercial-postmortems-2026.json'),record=get('specimens/itch-io.json');
 const a=data.cases.find(x=>x.id==='mixolumia'),b=data.cases.find(x=>x.id==='trouble_comes_twice');
 assert.deepEqual([a.itch_units,a.itch_gross_usd,a.itch_after_transaction_receipts_usd],[1776,17906,14980]);
 assert.equal(a.comparable_launch_exposure,false);
 assert.equal(a.final_developer_profit_usd,null);
 assert.equal(b.reported_combined_revenue_eur_approx,85000);
 assert.equal(b.itch_specific_revenue_eur,null);
 assert.equal(data.representative_median_itch_earnings,null);
 assert(data.sources.every(id=>record.evidence.some(s=>s.id===id)));
});

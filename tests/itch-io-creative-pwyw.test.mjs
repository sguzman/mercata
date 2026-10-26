import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('PWYW creator history preserves conflicting counts and no invented paid-game income',()=>{
 const x=read('ontology/itch-io/creative-free-games-pwyw-2019.json');
 assert.equal(x.published_works,34);
 assert.equal(x.gross_usd,7276.7);
 assert.equal(x.reported_payment_count_top,1072);
 assert.equal(x.reported_payment_count_bottom,1073);
 assert.equal(x.counts_internally_inconsistent,true);
 assert.equal(x.paid_minimum_game_units,null);
 assert.equal(x.developer_profit_after_labor_usd,null);
});

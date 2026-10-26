import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Game gifts and user account assignments are distinct from copyright and resale rights',()=>{
 const s=read('ontology/itch-io/resale-transfer-2026.json');
 const d=read('specimens/itch-io.json');
 assert(s.source_ids.every(id=>d.evidence.some(x=>x.id===id)));
 assert.equal(s.units.find(x=>x.id==='itch_user_account').may_be_sold_or_assigned,false);
 assert.equal(s.units.find(x=>x.id==='gift_purchase').same_as_secondary_resale,false);
 assert.equal(s.units.find(x=>x.id==='perpetual_game_license').resale_permission_platformwide,null);
 assert.equal(s.units.find(x=>x.id==='redownload').creates_new_paid_order,false);
 assert(Object.values(s.unresolved).every(x=>x===null));
});

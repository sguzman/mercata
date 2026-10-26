import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Free alpha discovery source maintains period, no inferred buyer orders or causal CTR',()=>{
 const x=load('ontology/itch-io/free-alpha-frontpage-tail-2026.json'),d=load('specimens/itch-io.json');const c=x.case;
 assert(x.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.equal(c.alpha_release_date,'2026-01-29');
 assert.equal(c.reported_steam_wishlist_increase_approx,2500);
 assert.equal(c.reported_closed_steam_playtest_applications_approx,2500);
 assert.equal(c.paid_itch_orders,null);assert.equal(c.paid_game_purchase_conversion,null);
 assert.equal(c.ctr_measurement_windows_identical,false);
 assert.equal(c.author_comment_later_frontpage_ctr_approx,0.004);
 assert.equal(c.promotion_causal_effect_identified,false);
 assert.equal(c.release_type,'free_alpha_used_for_pre_steam_marketing');
});

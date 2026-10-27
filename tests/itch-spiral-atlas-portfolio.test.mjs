import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Mixed portfolio project counts remain distinct from bundle transactions',()=>{
 const x=get('ontology/itch-io/spiral-atlas-portfolio-payments-2024.json'),s=get('specimens/itch-io.json');
 assert(x.source_ids.every(id=>s.evidence.some(e=>e.id===id)));
 assert.equal(x.projects.find(p=>p.name==='Northanger Abbey: The Game').payment_events,36);
 assert.equal(x.projects.find(p=>p.name==='Pride or Prejudice [DEMO]').payment_events,0);
 assert.equal(x.bundles.length,3); assert(x.bundles.every(b=>b.not_standalone_game_sales));
 assert.equal(x.paid_only_background_owner_accounts_reported,2);
 assert.equal(x.paid_only_background_download_events_reported,8);
});
test('Published Perpixeled payment ratio discrepancy is retained and tested',()=>{
 const x=get('ontology/itch-io/spiral-atlas-portfolio-payments-2024.json').projects.find(p=>p.name==='Perpixeled');
 assert.equal(x.source_reported_percent_ratio,0.3);
 assert(Math.abs(x.arithmetic_event_ratio_percent-3.3149)<0.01);
 assert.equal(x.source_ratio_inconsistent,true);
});
test('One selected PWYW portfolio never yields typical paid game seller income',()=>{
 const x=get('ontology/itch-io/spiral-atlas-portfolio-payments-2024.json');
 for(const k of ['unique_paying_people','mandatory_paid_game_conversion','market_average_income','market_median_income','zero_seller_share','genre_profit','owner_profit_after_labor'])assert.equal(x.population[k],null);
 assert.equal(x.population.homogeneous_paid_games,false);
});

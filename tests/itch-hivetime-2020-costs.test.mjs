import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Hive Time budget reconciles paid cash expenses separately from valued in-kind work in AUD',()=>{
 const x=read('ontology/itch-io/hive-time-2020-paid-downloads-and-costs.json'),s=read('specimens/itch-io.json');
 assert(x.source_ids.every(id=>s.evidence.some(e=>e.id===id)));
 const c=x.costs_aud;
 assert(Math.abs(c.initial_total_economic_account_aud-c.initial_valued_in_kind_costs_aud-c.initial_out_of_pocket_adjusted_aud)<0.001);
 assert(Math.abs(c.postrelease_update_total_economic_account_aud-c.postrelease_update_in_kind_costs_aud-c.postrelease_update_cash_aud)<0.001);
 assert.equal(c.initial_developer_pre_release_hours_approx,1050);
 assert.equal(x.financial_result.all_costs_and_labor_included,false);
});
test('Zero-minimum-price free download events, paid events, and bundle entitlements remain different populations',()=>{
 const x=read('ontology/itch-io/hive-time-2020-paid-downloads-and-costs.json').reported_sales;
 assert.equal(x.jul_2020_milestone_paid_events,500);
 assert.equal(x.sep_2020_download_events,40018);
 assert.equal(x.source_reported_paid_events_over_download_events_percent,1.36);
 assert.equal(x.half_downloads_is_validated_unique_players,false);
 assert.equal(x.bundle_entitlements_are_individual_standalone_sales,false);
 assert.equal(x.matched_downloaders_to_paid_people,null);
 assert.equal(x.settled_seller_receipts_usd,null);
});
test('One older PWYW game has no representative new paid game profit distribution',()=>{
 const x=read('ontology/itch-io/hive-time-2020-paid-downloads-and-costs.json');
 assert.equal(x.financial_result.reported_full_creator_profit_usd,null);
 assert.equal(x.financial_result.reported_full_creator_profit_aud,null);
 assert.equal(x.source_published_at,null);
});

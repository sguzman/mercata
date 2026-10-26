import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Indexing reform counts are not new game sales or new legitimate sellers',()=>{
 const x=read('ontology/itch-io/indexing-reform-creator-day-2026.json'),d=read('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
 assert.equal(x.indexing_event.announcement_date,'2026-10-19');
 assert.equal(x.indexing_event.reclassified_previously_blocked_pages_approx,215000);
 assert.equal(x.indexing_event.operator_reported_indexed_pages_lower_bound_exclusive,2000000);
 assert.equal(x.indexing_event.all_reclassified_pages_currently_confirmed_indexed,null);
 assert.equal(x.indexing_event.new_paid_game_releases_from_reform,null);
 assert.equal(x.indexing_event.week_suspended_or_banned_malware_spam_accounts_lower_bound_exclusive,10000);
 assert.equal(x.indexing_event.active_paid_publishers_observed,null);
});
test('Creator Day waiver is temporary and processing fees do not disappear',()=>{
 const e=read('ontology/itch-io/indexing-reform-creator-day-2026.json').creator_day;
 assert.equal(e.fee_waiver_length_hours,24);
 assert.equal(e.confirmed_future_event_date,null);
 assert.equal(e.processor_fees_still_apply,true);
 assert.equal(e.taxes_still_apply,true);
 assert.equal(e.hypothetical_same_order.before_other_costs_ordinary_usd,8.41);
 assert.equal(e.hypothetical_same_order.before_other_costs_waiver_usd,9.41);
 assert.equal(e.hypothetical_same_order.per_transaction_conditional_gain_usd,1);
 assert.equal(e.hypothetical_same_order.realized_sales_volume,null);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const x=JSON.parse(fs.readFileSync(new URL('../ontology/itch-io/year-of-springs-2026.json',import.meta.url),'utf8'));
test('Five-year itch case keeps paid orders separate from downloads and Steam-only refunds',()=>{
 assert.equal(x.itch_first_week.payments,324);
 assert.equal(x.itch_first_week.windows_downloads+x.itch_first_week.linux_downloads+x.itch_first_week.macos_downloads,458);
 assert.equal(x.itch_five_year_cumulative.payments,1789);
 assert.equal(x.other_stores_at_five_years.steam_units,19830);
 assert.equal(x.steam_only.refund_rate_percent,3.2);
 assert(Object.values(x.not_measured).every(v=>v===null));
 assert.equal(x.financial_conclusion.net_profit_verified,null);
});

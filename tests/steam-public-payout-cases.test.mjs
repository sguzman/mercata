import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/public-developer-payout-and-portfolio-cases-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
const cents=n=>Math.round(n*100);
test('Portfolio waterfall reconstructs published approximate steps without treating take-home as labor profit',()=>{
 const a=x.cases[0],r=a.reported,v=a.printed_values_reconstructed;
 const pre=r.gross_steam_sales_usd-r.refunds_usd-r.steam_platform_share_usd-r.us_withholding_usd-r.third_party_publisher_share_usd-r.local_tax_usd;
 assert.equal(pre,v.before_founder_split_usd);
 assert.equal(pre*r.cofounder_personal_fraction,v.one_founder_after_split_usd);
 assert.equal(v.one_founder_after_split_usd-r.one_person_claimed_take_home_usd,v.delta_from_reported_take_home_usd);
 assert.equal(a.game_count_with_revenue,2);assert.equal(a.recipient_count,2);
 assert.equal(a.after_unpaid_labor_economic_profit_usd,null);
 assert.equal(a.real_authorized_steam_finance_export,false);
});
test('Second case reconciles expense categories but flags reported summary near-miss',()=>{
 const b=x.cases[1],r=b.reported,v=b.printed_values_reconstructed;
 const costs=r.application_fees_usd+r.festival_fees_usd+r.assets_usd+r.commissions_usd+r.social_subscription_usd+r.reddit_ads_usd+r.hosting_usd;
 assert.equal(cents(costs),cents(v.sum_itemized_expenses_usd));
 assert.equal(cents(costs),cents(r.stated_total_expenses_usd));
 assert.equal(cents(r.post_platform_sales_usd-costs-r.stated_taxes_usd),cents(v.after_stated_costs_and_tax_usd));
 assert.equal(cents(v.after_stated_costs_and_tax_usd-r.stated_final_profit_usd),cents(v.delta_from_stated_final_profit_usd));
 assert.equal(b.game_count_with_revenue,2);
 assert.equal(b.application_fee_count_for_other_unreleased_games,4);
 assert.equal(b.after_unpaid_labor_economic_profit_usd,null);
});
test('No self-selected report silently becomes an actual population average or bank receipt',()=>{
 assert.equal(x.cases.length,2);
 assert(x.cases.every(c=>c.evidence_class==='self_report_unverified'&&c.real_authorized_steam_finance_export===false&&c.verified_publisher_bank_receipts_usd===null));
 assert.equal(x.shared_boundaries.probability_sample,false);
 assert.equal(x.shared_boundaries.complete_paid_release_frame,false);
 assert.equal(x.shared_boundaries.representative_median_publisher_payout_usd,null);
 assert.equal(x.shared_boundaries.after_labor_profit_median_usd,null);
 assert.equal(x.shared_boundaries.exact_zero_paid_sale_share,null);
});
test('All source and claim joins exist and fixed Steam task inventory is preserved',()=>{
 const sources=new Set(d.evidence.map(s=>s.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,2);assert.equal(x.claim_ids.length,10);
 for(const id of x.source_ids)assert(sources.has(id),id);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(z=>sources.has(z)),id);}
 const tasks=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(tasks.length,293);assert.equal(p.progress_percent,Math.round(tasks.reduce((a,b)=>a+b,0)/293));
});

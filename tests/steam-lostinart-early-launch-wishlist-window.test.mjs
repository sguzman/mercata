import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=load('ontology/steam/steam-lostinart-early-launch-wishlist-window-2026.json');
test('Commercial release identity and first-paid clock are separate from developer early-report window',()=>{
 const a=study.release,b=study.developer_public_launch_report;
 assert.equal(a.steam_appid,2900050);
 assert.equal(a.first_paid_release_date,'2026-06-01');
 assert.equal(b.published_date,'2026-06-03');
 assert.equal(b.time_from_launch_author_comment_approx_days,1.5);
 assert.equal(b.reported_units_sold_so_far,187);
 assert.equal(b.first_week_cumulative_paid_units_verified,null);
 assert.equal(b.first_month_cumulative_paid_units_verified,null);
});
test('Out-of-cohort wishlist stock cannot be converted into a matched paid buyer fraction',()=>{
 const a=study.developer_public_launch_report;
 assert.equal(a.prelaunch_outstanding_wishlists_approx,14000);
 assert.equal(a.wishlist_to_units_mechanical_quotient,187/14000);
 assert.equal(a.matched_wishlist_to_purchase_conversion_identified,false);
 assert.equal(a.wishlist_stock_is_eligible_buyers_cumulative_cohort,false);
 assert.equal(study.unknown.matched_release_wishlist_cohort_buyers,null);
 assert.equal(study.unknown.typical_paid_game_conversion,null);
 assert.equal(a.estimated_friends_and_family_units_lower,10);
 assert.equal(a.estimated_friends_and_family_units_upper,15);
 assert.equal(a.friends_purchase_verified,false);
});
test('Nested wishlist age, prelaunch demo, and streamer replies are not additive sales funnels',()=>{
 const a=study.author_comments;
 assert.equal(a.developer_reported_wishlists_recent_year_approx,9000);
 assert.equal(a.developer_reported_wishlists_last_three_months_approx,5000);
 assert.equal(a.three_month_wishlists_part_of_recent_year,true);
 assert.equal(a.demo_updated_for_nextfest,'2026-02');
 assert.equal(a.creator_positive_response_reported,1);
 assert.equal(a.creator_derived_paid_orders_verified,false);
 assert.equal(study.unknown.causal_demo_festival_lift,null);
});
test('One selected two-person studio is not two independent publisher-income cases',()=>{
 assert.equal(study.author_comments.team_members_reported,2);
 assert.equal(study.author_comments.developer_project_calendar_elapsed_years,3);
 assert.equal(study.author_comments.developer_near_fulltime_work_years_approx,2);
 assert.equal(study.selection_notes.one_game_one_reporting_team,true);
 assert.equal(study.selection_notes.current_store_reviews_are_not_launch_day_review_count,true);
 assert.equal(study.unknown.developer_net_partner_remittance,null);
 assert.equal(study.unknown.after_cost_or_labor_profit,null);
 assert(Object.values(study.unknown).every(value=>value===null));
});
test('All source and claim joins remain public and original 293 tasks are intact',()=>{
 const d=load('specimens/steam.json'),p=load('plans/steam.json'),q=load('queues/steam.json');
 const sources=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(study.source_ids.length,2);
 assert.equal(study.claim_ids.length,11);
 for(const id of study.source_ids)assert(sources.has(id),id);
 for(const id of study.claim_ids){
  assert(claims.has(id),id);
  assert(claims.get(id).source_ids.every(s=>sources.has(s)),id);
 }
 const scores=[...p.detail_tasks.map(x=>x.percent),...q.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(scores.length,293);
 assert.equal(Math.round(scores.reduce((sum,v)=>sum+v,0)/293),p.progress_percent);
 assert.equal(study.selection_notes.no_private_records_used,true);
});

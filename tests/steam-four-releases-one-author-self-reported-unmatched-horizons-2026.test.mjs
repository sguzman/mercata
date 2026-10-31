import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const j=JSON.parse(fs.readFileSync(new URL('../ontology/steam/steam-four-releases-one-author-self-reported-unmatched-horizons-2026.json',import.meta.url),'utf8'));
test('One author reports four nonzero title-copy counts at different release ages',()=>{
 assert.equal(j.report_rows.length,4);
 assert.deepEqual(j.report_rows.map(r=>r.release_year_reported),[2019,2021,2022,2023]);
 assert.deepEqual(j.report_rows.map(r=>r.copies_reported_as_of_post),[276,253,131,69]);
 assert(j.report_rows.every(r=>r.copies_reported_as_of_post>0));
 assert.equal(j.report_rows.reduce((a,r)=>a+r.copies_reported_as_of_post,0),
  j.aggregate.sum_of_four_author_reported_title_copies);
 assert.equal(j.aggregate.sum_of_four_author_reported_title_copies,729);
 assert.equal(j.aggregate.copies_are_not_unique_paying_customers,true);
});
test('Wishlists and a prelaunch fifth title are not purchase outcomes',()=>{
 assert.deepEqual(j.report_rows.map(r=>r.wishlist_stock_as_of_post_reported),[360,375,267,147]);
 assert.equal(j.aggregate.fifth_project_wishlists_reported,10);
 assert.equal(j.aggregate.fifth_project_paid_sales_unknown,null);
 assert.equal(j.aggregate.legal_publisher_identity_verified,false);
});
test('Missing matched sales horizons, actual zero paid games and developer income remain unknown',()=>{
 assert(Object.values(j.unknown).every(x=>x===null));
 assert.equal(j.aggregate.reporting_date_shared_but_release_age_differs,true);
 assert.equal(j.original_author_is_voluntary_case_not_representative_sample,true);
 assert.equal(j.no_real_appids_or_accounts_collected,true);
 assert.equal(j.source_ids.length,1);assert.equal(j.claim_ids.length,4);
});

test('Self-report claim provenance and original 293-task portfolio scores remain linked',()=>{
 const root=new URL('../',import.meta.url);
 const read=p=>JSON.parse(fs.readFileSync(new URL(p,root),'utf8'));
 const d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
 const ss=new Set(d.evidence.map(e=>e.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 for(const id of j.source_ids)assert(ss.has(id),id);
 for(const id of j.claim_ids){
  const c=claims.get(id);assert(c,id);assert(c.source_ids.every(s=>ss.has(s)),id);
 }
 const all=[...p.detail_tasks,...q.queues.flatMap(g=>g.tasks)];
 assert.equal(all.length,293);assert.equal(new Set(all.map(x=>x.id)).size,293);
 for(const id of ["steam/market/distinguish-indie-solo-and-studio-supply","steam/competition/classify-portfolio-publishers"]){
  const t=all.find(x=>x.id===id);assert(t,id);
  for(const ref of ["ontology/steam/steam-four-releases-one-author-self-reported-unmatched-horizons-2026.md","ontology/steam/steam-four-releases-one-author-self-reported-unmatched-horizons-2026.json","tests/steam-four-releases-one-author-self-reported-unmatched-horizons-2026.test.mjs"])assert(t.evidence.includes(ref),ref);
 }
 assert.equal(p.progress_percent,Math.round(all.reduce((s,t)=>s+(t.percent??t.progress),0)/293));
});

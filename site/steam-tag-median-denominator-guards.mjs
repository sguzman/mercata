// Public modeled tag summary QA. No sales ledgers, price estimator, or causal genre recommendations.
const nonneg=n=>Number.isSafeInteger(n)&&n>=0;
const finite=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0;
export function auditPublicSteamTagMedians({published_tag_count,published_below_5000,published_below_10000,median_of_tag_medians_usd,tag_rows}={}){
 if(!nonneg(published_tag_count)||published_tag_count===0||!nonneg(published_below_5000)||
   !nonneg(published_below_10000)||published_below_5000>published_below_10000||
   published_below_10000>published_tag_count||!finite(median_of_tag_medians_usd))
   throw new TypeError('Invalid public tag-count summary');
 if(!Array.isArray(tag_rows)||tag_rows.length<1||tag_rows.length>published_tag_count)
   throw new TypeError('Invalid selected tag rows');
 const seen=new Set(),rows=[];
 for(const row of tag_rows){
  if(!row||Object.keys(row).some(k=>!['tag','tag_catalog_titles','reported_median_copies_all_paid_and_free','reported_paid_only_median_revenue_proxy_usd','midrank_sample_approx_n'].includes(k)))
   throw new TypeError('No raw records, personal data or unrelated properties allowed');
  if(typeof row.tag!=='string'||!/^[A-Za-z0-9 +&-]{2,60}$/.test(row.tag)||seen.has(row.tag)||
   !nonneg(row.tag_catalog_titles)||row.tag_catalog_titles<1||
   !finite(row.reported_median_copies_all_paid_and_free)||!finite(row.reported_paid_only_median_revenue_proxy_usd)||
   !nonneg(row.midrank_sample_approx_n)||row.midrank_sample_approx_n<1)
   throw new TypeError('Invalid or repeated public tag summary');
  seen.add(row.tag);
  rows.push({tag:row.tag,catalog_titles_labeled_with_tag:row.tag_catalog_titles,
    author_reported_median_copies_all_free_and_paid:row.reported_median_copies_all_paid_and_free,
    author_reported_paid_only_median_revenue_proxy_usd:row.reported_paid_only_median_revenue_proxy_usd,
    approximate_titles_sampled_near_midrank:row.midrank_sample_approx_n,
    actual_merchant_gross_usd:null,paid_game_median_copies:null,
    average_paid_unit_checkout_price_usd:null,
    derived_ratio_of_two_medians_as_unit_price_usd:null,
    median_revenue_verified_from_entire_tag_catalog:false});
 }
 return {kind:'unmatched_tag_medians_model_snapshots_not_a_paid_release_revenue_census',
  summary:{tags_observed_by_provider:published_tag_count,tags_median_revenue_proxy_below_5000:published_below_5000,
   tags_median_revenue_proxy_below_10000:published_below_10000,
   unweighted_median_of_tag_medians_usd:median_of_tag_medians_usd,
   selected_tag_summaries:tag_rows.length},
  rows,genre_tags_overlap:true,copy_and_revenue_median_populations_differ:true,
  source_method_midrank_selection_not_full_raw_merchant_ledger:true,
  median_of_tag_medians_is_median_paid_game_income:false,
  reported_revenue_proxy_is_realized_checkouts:false,
  actual_fixed_launch_horizon:null,population_paid_release_median_usd:null,
  distinct_legal_publishers:null,causal_best_genre:null,developer_profit_usd:null,
  caveat:'Paid-only estimated gross and all-license modeled copies have different denominators; neither ratios of medians nor median of overlapping tag medians identify per-copy price or a representative paid Steam game.'};
}

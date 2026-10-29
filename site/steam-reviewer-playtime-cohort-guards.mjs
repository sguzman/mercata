// Pure aggregate integrity checks, never a source of buyer or publisher revenue estimates.
const validCount=(v,label)=>{if(!Number.isSafeInteger(v)||v<=0)throw new TypeError('Invalid '+label);return v;};
const validShare=(v,label)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<0||v>100)throw new TypeError('Invalid '+label);return v;};
export function auditSteamReviewerPlaytimeAggregates(data){
 if(!data||typeof data!=='object')throw new TypeError('Expected source aggregate object');
 const {game_count,price_bands,review_cost_per_hour_bands,within_price_playtime_quartiles,genre_bands,release_year_cohorts}=data;
 validCount(game_count,'game count');
 for(const [key,rows] of Object.entries({price_bands,review_cost_per_hour_bands,genre_bands,release_year_cohorts})){
  if(!Array.isArray(rows)||rows.length===0)throw new TypeError('Missing '+key);
 }
 const sum=(rows)=>rows.reduce((acc,r)=>acc+validCount(r.game_count,'band count'),0);
 const unique=(rows,key)=>{const seen=new Set();for(const r of rows){if(!r||typeof r[key]!=='string'||seen.has(r[key]))throw new RangeError('Duplicate or missing '+key);seen.add(r[key]);}};
 unique(price_bands,'band');unique(review_cost_per_hour_bands,'band');unique(genre_bands,'name');unique(release_year_cohorts,'cohort');
 for(const r of price_bands){
  if(typeof r.median_reviewer_hours!=='number'||!Number.isFinite(r.median_reviewer_hours)||r.median_reviewer_hours<=0)throw new TypeError('Invalid median reviewer hours');
  if(typeof r.median_list_usd_per_reviewer_hour!=='number'||!Number.isFinite(r.median_list_usd_per_reviewer_hour)||r.median_list_usd_per_reviewer_hour<=0)throw new TypeError('Invalid list-price ratio');
 }
 for(const r of review_cost_per_hour_bands){
  validShare(r.median_positive_review_pct,'review median');validShare(r.share_of_games_under70positive_pct,'low-score fraction');
 }
 for(const r of genre_bands){if(typeof r.median_list_usd_per_reviewer_hour!=='number'||!Number.isFinite(r.median_list_usd_per_reviewer_hour)||r.median_list_usd_per_reviewer_hour<=0)throw new TypeError('Invalid genre ratio');}
 if(!within_price_playtime_quartiles||!Array.isArray(within_price_playtime_quartiles.bands))throw new TypeError('Missing within-price data');
 validCount(within_price_playtime_quartiles.sampled_quartile_groups_game_count,'within-price sample');
 for(const r of within_price_playtime_quartiles.bands){
  validShare(r.shortest_quartile_median_positive_pct,'shortest score');validShare(r.longest_quartile_median_positive_pct,'longest score');
 }
 const totals={price_bands:sum(price_bands),genres:sum(genre_bands),release_cohorts:sum(release_year_cohorts)};
 if(Object.values(totals).some(v=>v!==game_count))throw new RangeError('Source cohort counts disagree');
 const plateau=price_bands.slice(2).map(x=>x.median_list_usd_per_reviewer_hour);
 const scoreSpread=review_cost_per_hour_bands[0].median_positive_review_pct-review_cost_per_hour_bands.at(-1).median_positive_review_pct;
 const lowScoreSpread=review_cost_per_hour_bands.at(-1).share_of_games_under70positive_pct-review_cost_per_hour_bands[0].share_of_games_under70positive_pct;
 const quartileGaps=within_price_playtime_quartiles.bands.map(r=>r.longest_quartile_median_positive_pct-r.shortest_quartile_median_positive_pct);
 return {curated_game_count:game_count,source_count_checks:totals,minimum_median_reviewer_hours:Math.min(...price_bands.map(r=>r.median_reviewer_hours)),
 maximum_median_reviewer_hours:Math.max(...price_bands.map(r=>r.median_reviewer_hours)),
 ten_dollar_plus_regular_price_ratio_min:Math.min(...plateau),ten_dollar_plus_regular_price_ratio_max:Math.max(...plateau),
 median_positive_review_gradient_points:Number(scoreSpread.toFixed(1)),under70positive_game_share_gradient_points:Number(lowScoreSpread.toFixed(1)),
 within_price_long_minus_short_review_points:quartileGaps.map(v=>Number(v.toFixed(1))),
 selected_reviewers_only:true,originally_paid_population_frame_verified:false,
 average_buyer_playtime:null,actual_checkout_price:null,causal_price_elasticity:null,causal_playtime_review_effect:null,
 total_paid_game_units:null,after_cost_publisher_profit:null,
 note:'Curated, selected public review aggregates do not infer actual purchase outcomes or causality.'};
}

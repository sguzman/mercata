// Compare only dated public aggregate model summaries: no game IDs, reviews or merchant reports.
const shape=(x,keys)=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&
 Object.keys(x).every(k=>keys.includes(k));
const iso=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&
 Number.isFinite(Date.parse(s+'T00:00:00Z'))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
const nat=n=>Number.isSafeInteger(n)&&n>=0&&n<=1000000;
const names=['puregamestats','weloveit'];
const fields=['id','source_id','observed_on','report_url','priced_reviewed_games',
 'model_estimated_lifetime_gross_usd_billions','model_estimated_lifetime_median_gross_usd',
 'model_top_one_percent_share','priced_zero_review_games','publisher_income_known',
 'review_based_sales_estimation','cohort_appids_matched_with_other_provider',
 'outcome_tier_counts','outcome_tiers_usd'];
const tierIds=['under_10000','10000_to_249999','250000_to_999999','1000000_to_9999999',
 '10000000_to_99999999','100000000_to_999999999','1000000000_plus'];
export function auditSteamReviewGrossModelDisagreement(rows){
 if(!Array.isArray(rows)||rows.length!==2)throw new TypeError('Exactly two attributed public summaries required');
 const byName=new Map();
 for(const r of rows){
  if(!shape(r,fields)||!names.includes(r.id)||byName.has(r.id)||
   typeof r.source_id!=='string'||!r.source_id.startsWith('steam-')||
   typeof r.report_url!=='string'||!r.report_url.startsWith('https://')||
   !iso(r.observed_on)||!nat(r.priced_reviewed_games)||!r.priced_reviewed_games||
   !Number.isFinite(r.model_estimated_lifetime_gross_usd_billions)||
   r.model_estimated_lifetime_gross_usd_billions<=0||
   !nat(r.model_estimated_lifetime_median_gross_usd)||
   !Number.isFinite(r.model_top_one_percent_share)||
   r.model_top_one_percent_share<=0||r.model_top_one_percent_share>=1||
   !(r.priced_zero_review_games===null||nat(r.priced_zero_review_games))||
   r.publisher_income_known!==false||r.review_based_sales_estimation!==true||
   r.cohort_appids_matched_with_other_provider!==false)
   throw new TypeError('Only bounded, public, review-gated gross model reports allowed');
  const isPG=r.id==='puregamestats';
  if(isPG){
   if(!Array.isArray(r.outcome_tier_counts)||r.outcome_tier_counts.length!==7||
    !r.outcome_tier_counts.every(nat)||!Array.isArray(r.outcome_tiers_usd)||
    r.outcome_tiers_usd.join('|')!==tierIds.join('|')||
    r.outcome_tier_counts.reduce((a,b)=>a+b,0)!==r.priced_reviewed_games||
    r.priced_zero_review_games!==null)
    throw new RangeError('Provider reported modeled gross tier bins do not reconcile');
  }else if(r.outcome_tier_counts!==null||r.outcome_tiers_usd!==null)
   throw new TypeError('No second-provider tier rows supplied');
  byName.set(r.id,r);
 }
 const a=byName.get('puregamestats'),b=byName.get('weloveit');
 return Object.freeze({
  kind:'unmatched_two_provider_review_gross_comparison_not_validated_publisher_income',
  dated_provider_count:2,
  providers:rows.map(r=>Object.freeze({id:r.id,observed_on:r.observed_on,
   modeled_games_with_reviews:r.priced_reviewed_games,
   modeled_median_lifetime_gross_usd:r.model_estimated_lifetime_median_gross_usd,
   modeled_top_one_percent_gross_share:r.model_top_one_percent_share})),
  reported_count_difference_b_minus_a:b.priced_reviewed_games-a.priced_reviewed_games,
  reported_model_median_ratio_b_to_a:b.model_estimated_lifetime_median_gross_usd/a.model_estimated_lifetime_median_gross_usd,
  provider_b_reported_reviewless_priced_games:b.priced_zero_review_games,
  total_paid_games_historically_launched:null,
  compared_game_rosters_matched:false,
  top_one_percent_measures_verified_actual_revenue:false,
  model_disagreement_is_empirical_error_interval:false,
  actual_zero_paid_order_count:null,
  actual_paid_order_distribution:null,
  verified_legal_publisher_income_median:null,
  verified_studio_net_profit_median:null,
  caveat:'Two changing price/review estimators omit zero-review games from positive-review modeled samples and do not share a validated AppID cohort. Their medians are modeled gross, not comparable checkout receipts or actual legal publisher net income.'
 });
}

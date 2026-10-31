// Aggregate-only cross-study comparison for three public, researcher-selected Steam launch-day panels.
// No game identifiers, buyers, private ledgers or reviews may enter this model.
const plain=(x,allowed)=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&
 Object.keys(x).every(k=>allowed.includes(k));
const day=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&
 Number.isFinite(Date.parse(s+'T00:00:00Z'))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
const int=x=>Number.isSafeInteger(x)&&x>=0&&x<=1000000;
const schema=['panel_id','source_id','release_days','release_scope','observed_followup_days_approx',
 'outcome_measure','estimated_by','reported_eligible_games','reported_bucket_counts','low_signal_count',
 'author_reported_low_signal_percent'];
const paidScopes=new Set(['author_selected_uncertified_paid_origin','author_filtered_paid_apps_unverified_first_paid_origin']);
const metrics=new Set(['third_party_estimated_near_zero_sales','public_review_count_below_ten']);
export function auditSelectedSteamLowSignalPanels(panels){
 if(!Array.isArray(panels)||panels.length<2||panels.length>6)
  throw new TypeError('Two to six selected aggregate panels required');
 const ids=new Set(),days=new Set(),rows=[];
 for(const p of panels){
  if(!plain(p,schema)||typeof p.panel_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(p.panel_id)||
   ids.has(p.panel_id)||typeof p.source_id!=='string'||!/^steam-selected-[a-z0-9-]+$/.test(p.source_id)||
   !Array.isArray(p.release_days)||p.release_days.length<1||p.release_days.length>2||
   !paidScopes.has(p.release_scope)||!metrics.has(p.outcome_measure)||
   !int(p.observed_followup_days_approx)||p.observed_followup_days_approx===0||
   !int(p.reported_eligible_games)||p.reported_eligible_games===0||
   !Array.isArray(p.reported_bucket_counts)||p.reported_bucket_counts.length<2||p.reported_bucket_counts.length>8||
   !p.reported_bucket_counts.every(int)||!int(p.low_signal_count)||
   p.author_reported_low_signal_percent!==null&&
    (!Number.isFinite(p.author_reported_low_signal_percent)||p.author_reported_low_signal_percent<0||p.author_reported_low_signal_percent>100))
   throw new TypeError('Only bounded, source-labelled selected-day aggregate counts are accepted');
  ids.add(p.panel_id);
  if(p.outcome_measure==='third_party_estimated_near_zero_sales'&&p.estimated_by!=='Gamalytic'||
     p.outcome_measure==='public_review_count_below_ten'&&p.estimated_by!==null)
   throw new TypeError('Do not relabel estimated gross as observed reviews, or vice versa');
  if(p.reported_bucket_counts.reduce((a,b)=>a+b,0)!==p.reported_eligible_games||
   p.reported_bucket_counts[0]!==p.low_signal_count)
   throw new RangeError('Published aggregate bins must reconcile to declared selected title count');
  for(const d of p.release_days){
   if(!day(d)||days.has(d))throw new RangeError('Invalid or shared selected release calendar day');
   days.add(d);
  }
  if([...p.release_days].sort().join('|')!==p.release_days.join('|'))
   throw new RangeError('Release days must be chronologically sorted');
  const share=p.low_signal_count/p.reported_eligible_games;
  rows.push(Object.freeze({
   panel_id:p.panel_id,source_id:p.source_id,
   source_reported_selected_game_count:p.reported_eligible_games,
   source_reported_low_signal_games:p.low_signal_count,
   reported_bucket_total:p.reported_bucket_counts.reduce((a,b)=>a+b,0),
   low_signal_share_among_author_selected_entries:share,
   rounded_low_signal_share_percent_one_decimal:Math.round(1000*share)/10,
   author_reported_low_signal_percent:p.author_reported_low_signal_percent,
   author_label_matches_nearest_integer_share:p.author_reported_low_signal_percent===null?
    null:Math.round(share*100)===p.author_reported_low_signal_percent,
   measured_unit:p.outcome_measure,estimated_by:p.estimated_by,
   followup_days_approx:p.observed_followup_days_approx,
   original_paid_status_verified:false,
   actual_zero_paid_orders:null,actual_zero_paid_fraction:null,
   median_publisher_profit:null
  }));
 }
 return Object.freeze({
  kind:'selected_public_launch_day_aggregate_comparison_not_steam_paid_order_census',
  distinct_selected_launch_day_count:days.size,
  reviewed_panel_count:rows.length,rows,
  same_population_and_followup_across_panels:false,
  pooled_low_signal_rate:null,measured_year_over_year_change:null,
  identical_method_and_representative_sample:false,
  actual_exact_zero_paid_sale_fraction:null,actual_total_paid_first_launch_frame:null,
  actual_steam_game_sales:null,verified_publisher_cash:null,
  no_private_reviewer_or_customer_data_processed:true,
  caveat:'Model-estimated near-zero copies and fewer than ten public reviews are different outcomes. A reported zero-or-almost-zero model bucket is not verified zero orders. Handpicked launch dates, different periods and unequal observation windows cannot establish a marketwide zero-sales fraction or a temporal trend.'
 });
}

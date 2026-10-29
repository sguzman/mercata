// Source-snapshot seasonality description only; not a causal game-launch or revenue estimator.
const ORDER=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export function auditSteamSeasonalReviewProxy(rows){
 if(!Array.isArray(rows)||rows.length!==12)throw new TypeError('Expected twelve monthly aggregate rows');
 const seen=new Set();
 for(const r of rows){
  if(!r||!ORDER.includes(r.month)||seen.has(r.month))throw new RangeError('Invalid or duplicate month');
  seen.add(r.month);
  if(!Number.isSafeInteger(r.releases)||r.releases<0)throw new TypeError('Invalid release count');
  if(typeof r.review_50plus_percent!=='number'||!Number.isFinite(r.review_50plus_percent)||r.review_50plus_percent<0||r.review_50plus_percent>100)
   throw new TypeError('Invalid rounded review percentage');
 }
 const ordered=ORDER.map(m=>rows.find(r=>r.month===m));
 const total=ordered.reduce((n,r)=>n+r.releases,0);
 const releasesDescending=[...ordered].sort((a,b)=>b.releases-a.releases);
 const reviewsDescending=[...ordered].sort((a,b)=>b.review_50plus_percent-a.review_50plus_percent);
 const peak=releasesDescending[0],quiet=releasesDescending.at(-1);
 return {total_crossyear_releases:total,most_releases_month:peak.month,most_releases:peak.releases,
  fewest_releases_month:quiet.month,fewest_releases:quiet.releases,
  peak_to_quiet_volume_ratio:quiet.releases?peak.releases/quiet.releases:null,
  highest_review_threshold_month:reviewsDescending[0].month,
  lowest_review_threshold_month:reviewsDescending.at(-1).month,
  threshold_rate_spread_percentage_points:reviewsDescending[0].review_50plus_percent-reviewsDescending.at(-1).review_50plus_percent,
  monthly_rates_are_rounded:true,exact_50review_game_counts:null,first_30day_review_rate:null,
  observed_paid_game_orders:null,causal_effect_of_launch_month:null,publisher_profit:null,
  warning:'Cross-year public review threshold and release counts do not establish causal effects, fixed-age outcomes, sales or profits.'};
}

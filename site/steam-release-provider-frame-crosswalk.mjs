// Three public catalog counters, never an AppID-matched census or a statistical interval.
const iso=x=>{
 if(typeof x!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(x))return false;
 const n=Date.parse(x+'T00:00:00Z');
 return Number.isFinite(n)&&new Date(n).toISOString().slice(0,10)===x;
};
export function compareSyntheticSteamReleaseYearCounters(rows){
 if(!Array.isArray(rows)||rows.length<2||rows.length>10)throw new TypeError('Two to ten attributable aggregate counters required');
 const seen=new Set(),counts=[],dates=new Set();
 let year=null;
 for(const x of rows){
  const keys=['source_id','provider','release_year','reported_games','catalog_counted_at','observed_at','roster_type','matched_appid_roster_available','original_paid_first_release_verified'];
  if(!x||typeof x!=='object'||Array.isArray(x)||Object.keys(x).some(k=>!keys.includes(k)))
   throw new TypeError('Public aggregate only, without raw apps or identities');
  if(typeof x.source_id!=='string'||!/^steam[-a-z0-9]+$/.test(x.source_id)||seen.has(x.source_id)||
   typeof x.provider!=='string'||!/^[-A-Za-z0-9 ]{2,60}$/.test(x.provider)||
   typeof x.roster_type!=='string'||!/^[-a-z0-9_]+$/.test(x.roster_type))
   throw new TypeError('Unique public source, provider and classification required');
  seen.add(x.source_id);
  if(!Number.isInteger(x.release_year)||x.release_year<2000||x.release_year>2100||
   !Number.isSafeInteger(x.reported_games)||x.reported_games<1)
   throw new TypeError('Invalid publication-year game count');
  if(year===null)year=x.release_year;
  else if(year!==x.release_year)throw new RangeError('Incompatible release years');
  if(!iso(x.observed_at)||x.catalog_counted_at!==null&&!iso(x.catalog_counted_at)||
   x.catalog_counted_at!==null&&x.catalog_counted_at>x.observed_at)
   throw new TypeError('Unknown or inconsistent observation date');
  if(x.matched_appid_roster_available!==false||x.original_paid_first_release_verified!==false)
   throw new TypeError('No matching original-paid AppID evidence was provided');
  if(x.catalog_counted_at!==null)dates.add(x.catalog_counted_at);else dates.add('unknown');
  counts.push(x.reported_games);
 }
 const min=Math.min(...counts),max=Math.max(...counts);
 return {kind:'unmatched_secondary_release_year_counter_comparison_not_paid_game_census',
  release_year:year,provider_count:rows.length,counts_by_provider:rows.map(x=>({provider:x.provider,source_id:x.source_id,reported_games:x.reported_games,observed_at:x.observed_at,catalog_counted_at:x.catalog_counted_at})),
  minimum_reported_catalog_games:min,maximum_reported_catalog_games:max,
  spread_between_reported_counts:max-min,
  span_is_statistical_confidence_interval:false,all_capture_dates_known_and_aligned:dates.size===1&&!dates.has('unknown'),
  original_paid_release_frame_attested:false,actual_historical_total_games:null,
  initial_paid_releases:null,actual_zero_paid_sales_share:null,
  legal_publisher_income:null,
  caveat:'Subtraction across unmatched and non-coincident catalog rosters measures disagreement only. It cannot bound a true total or diagnose which provider omitted/added which titles.'};
}

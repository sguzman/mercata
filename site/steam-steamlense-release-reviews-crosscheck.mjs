// Bounded public Steamlense current-catalog cross-check; no app, buyer or account rows.
const iso=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&
 Number.isFinite(Date.parse(s+'T00:00:00Z'))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
const plain=(o,fields)=>o!==null&&typeof o==='object'&&!Array.isArray(o)&&
 Object.keys(o).every(k=>fields.includes(k));
const integer=x=>Number.isSafeInteger(x)&&x>=0&&x<=1000000;
export function auditSteamLensePublicCatalogSnapshot(data){
 if(!plain(data,['observed_at','provider','provider_release_year_rows','provider_review_count_row'])||
  !iso(data.observed_at)||data.provider!=='Steamlense'||
  !Array.isArray(data.provider_release_year_rows)||data.provider_release_year_rows.length!==2)
  throw new TypeError('Dated public Steamlense aggregate snapshot required');
 const rows=data.provider_release_year_rows;
 for(let i=0;i<rows.length;i++){
  const r=rows[i];
  if(!plain(r,['year','reported_paid_games','reported_free_to_play_games','reported_all_games'])||
   r.year!==2024+i||!integer(r.reported_paid_games)||!integer(r.reported_free_to_play_games)||
   !integer(r.reported_all_games)||r.reported_all_games===0||
   r.reported_paid_games+r.reported_free_to_play_games!==r.reported_all_games)
   throw new RangeError('Incompatible year, category or aggregate total');
 }
 const review=data.provider_review_count_row;
 if(!plain(review,['release_year','reported_share_below_ten_reviews_percent','denominator','observation_window'])||
  review.release_year!==2025||
  typeof review.reported_share_below_ten_reviews_percent!=='number'||
  !Number.isFinite(review.reported_share_below_ten_reviews_percent)||
  review.reported_share_below_ten_reviews_percent<0||
  review.reported_share_below_ten_reviews_percent>100||
  review.denominator!=='all_currently_observed_2025_released_games_in_provider_catalog_including_free_to_play'||
  review.observation_window!=='reviews_accumulated_by_public_snapshot_not_matched_fixed_age_after_release')
  throw new TypeError('Reviews must be a bounded all-game present-day share, not verified paid orders');
 return Object.freeze({
  kind:'live_provider_captured_catalog_paid_free_crosscheck_not_originally_paid_or_financial_census',
  observed_at:data.observed_at,
  years:rows.map(r=>Object.freeze({
   year:r.year,provider_reported_current_catalog_paid:r.reported_paid_games,
   provider_reported_current_catalog_free:r.reported_free_to_play_games,
   provider_reported_current_catalog_total:r.reported_all_games,
   paid_share_of_provider_current_catalog:r.reported_paid_games/r.reported_all_games
  })),
  provider_reported_catalog_game_count_increase_2024_to_2025:rows[1].reported_all_games-rows[0].reported_all_games,
  provider_reported_paid_category_count_increase_2024_to_2025:rows[1].reported_paid_games-rows[0].reported_paid_games,
  fraction_of_2025_current_catalog_under_ten_public_reviews:review.reported_share_below_ten_reviews_percent/100,
  share_is_all_paid_and_free_games_combined:true,
  measured_at_fixed_age_after_first_paid_release:false,
  originally_paid_first_public_launch_verified:false,
  delisted_historical_games_fully_included:false,
  shares_are_transaction_weighted:false,
  actual_zero_paid_sale_rate:null,
  verified_paid_units:null,legal_publisher_income:null,
  caveat:'An annual current-catalog category split does not verify initial positive-price launch, missing delisted titles or the number of zero-order games. Low review counts do not imply zero sales; snapshot review ages vary.'
 });
}

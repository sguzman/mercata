// Selected top-500 model composition is not a first-paid-game income census.
// Input is a public-summary-shaped SYNTHETIC aggregate, never game rows or payment data.
const validFraction=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0&&x<=1;
export function auditSyntheticTop500SteamMonth(input){
 const keys=['fixture_id','ranked_games','top500_platform_share','new_ip_revenue_share',
   'established_ip_revenue_share','f2p_revenue_share','f2p_title_fraction',
   'released_2026_revenue_share','released_2025_revenue_share','released_2024_revenue_share',
   'full_year_has_ended'];
 if(!input||typeof input!=='object'||Array.isArray(input)||
   Object.keys(input).some(x=>!keys.includes(x))||
   typeof input.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(input.fixture_id))
  throw new TypeError('Only synthetic aggregate month cohort fields accepted');
 if(!Number.isSafeInteger(input.ranked_games)||input.ranked_games<1)
  throw new TypeError('Positive ranked title count required');
 for(const key of keys.filter(k=>k.includes('share')||k.includes('fraction')))
  if(!validFraction(input[key]))throw new TypeError('Invalid bounded share: '+key);
 if(input.full_year_has_ended!==false)throw new TypeError('September snapshot is not an observed annual close');
 if(Math.abs(input.new_ip_revenue_share+input.established_ip_revenue_share-1)>1e-9)
  throw new RangeError('New versus established IP is one partition');
 const releaseSum=input.released_2026_revenue_share+input.released_2025_revenue_share+input.released_2024_revenue_share;
 if(releaseSum>1+1e-9)throw new RangeError('Disjoint release-year groups exceed cohort');
 return {synthetic_fixture:input.fixture_id,ranked_games:input.ranked_games,
   top_ranked_platform_revenue_share:input.top500_platform_share,
   reported_f2p_title_fraction:input.f2p_title_fraction,
   reported_f2p_revenue_fraction_within_top_ranked:input.f2p_revenue_share,
   other_release_years_revenue_share_if_disjoint:Math.max(0,1-releaseSum),
   observed_calendar_year_2026_gross:null,
   actual_publisher_bank_remittances:null,
   representative_paid_first_release_median:null,
   actual_zero_sale_fraction:null,
   first_paid_release_cohort_complete:false};
}

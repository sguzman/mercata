// Prevent denominator laundering across first-party platform reach and selected annual promotions.
const positive=(x,k)=>{if(!Number.isSafeInteger(x)||x<=0)throw new TypeError('Positive safe integer required for '+k);return x;};
export function auditSteamPublicAudienceDenominators({advertisedMonthlyActiveFloor,advertisedDailyImpressions,selectedAnnualPromotionBuyers}={}){
 const monthlyActive=positive(advertisedMonthlyActiveFloor,'monthly active floor');
 const dailyImpressions=positive(advertisedDailyImpressions,'daily impressions');
 const annualDealBuyers=positive(selectedAnnualPromotionBuyers,'annual promotion buyers');
 return {metric_scope:'unmatched_public_marketing_snapshots',
  monthly_active_users_advertised_floor:monthlyActive,
  daily_impressions_advertised_rounded:dailyImpressions,
  selected_annual_promotion_buyers_reported:annualDealBuyers,
  aligned_measurement_periods:false,verified_paid_buyer_count:null,
  annual_paying_customer_fraction:null,monthly_paying_customer_fraction:null,
  per_unique_user_daily_impressions:null,indie_premium_game_paid_buyers:null,
  incrementally_attributed_paid_orders:null,publisher_profit:null,
  note:'Undated monthly active users, rounded daily impressions and selected annual promotion buyers are separate units. No ratio identifies Steam paid customer reach.'};
}

// Synthetic, self-report launch and event windows only. Never accept real app/account IDs or transaction rows.
const keys=new Set(['fixture_id','first_3day_units','first_week_units','later_units','niche_wishlist_additions','nextfest_wishlist_additions','same_observation_cohort']);
export function auditSyntheticEventLaunchWindows(row){
 if(!row||typeof row!=='object'||Array.isArray(row)||Object.keys(row).some(k=>!keys.has(k))||
 typeof row.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(row.fixture_id)||
 !['first_3day_units','first_week_units','later_units','niche_wishlist_additions','nextfest_wishlist_additions'].every(k=>Number.isSafeInteger(row[k])&&row[k]>=0)||
 row.first_3day_units>row.first_week_units||row.first_week_units>row.later_units||
 typeof row.same_observation_cohort!=='boolean')
 throw new TypeError('Expected bounded synthetic event and launch windows');
 return Object.freeze({
  nested_sale_checkpoints:true,
  descriptive_first3day_to_week_increment:row.same_observation_cohort?row.first_week_units-row.first_3day_units:null,
  descriptive_firstweek_to_later_increment:row.same_observation_cohort?row.later_units-row.first_week_units:null,
  descriptive_reported_event_addition_ratio:row.nextfest_wishlist_additions>0?row.niche_wishlist_additions/row.nextfest_wishlist_additions:null,
  causal_event_effect:null,matched_launch_wishlist_purchase_conversion:null,
  actual_partner_bank_receipts:null,developer_after_cost_profit:null,
  representative_first_paid_game_median:null,zero_paid_sale_fraction:null
 });
}

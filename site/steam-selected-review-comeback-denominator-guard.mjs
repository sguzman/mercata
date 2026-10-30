// Pure synthetic denominators for a selected review-revival study, not Steam purchases or causal effects.
const fields=new Set(['fixture_id','selected_games','faded_games','comeback_games','full_release_events','full_release_comebacks',
 'major_update_events','major_update_comebacks','quiet_months','reported_quiet_comeback_rate_pct']);
export function auditSyntheticSelectedReviewCombacks(row){
 if(!row||typeof row!=='object'||Array.isArray(row)||Object.keys(row).some(k=>!fields.has(k))||
 typeof row.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(row.fixture_id)||
 !['selected_games','faded_games','comeback_games','full_release_events','full_release_comebacks','major_update_events','major_update_comebacks','quiet_months'].every(k=>Number.isSafeInteger(row[k])&&row[k]>=0)||
 row.selected_games===0||row.quiet_months===0||row.faded_games>row.selected_games||row.comeback_games>row.faded_games||
 row.full_release_comebacks>row.full_release_events||row.major_update_comebacks>row.major_update_events||
 typeof row.reported_quiet_comeback_rate_pct!=='number'||!Number.isFinite(row.reported_quiet_comeback_rate_pct)||
 row.reported_quiet_comeback_rate_pct<0||row.reported_quiet_comeback_rate_pct>100)
 throw new TypeError('Invalid synthetic review event or month denominators');
 return Object.freeze({
  faded_fraction_of_selected_review_rich_games:row.faded_games/row.selected_games,
  game_level_ever_comeback_fraction_of_faded:row.faded_games?row.comeback_games/row.faded_games:null,
  full_release_event_association:row.full_release_events?row.full_release_comebacks/row.full_release_events:null,
  major_update_event_association:row.major_update_events?row.major_update_comebacks/row.major_update_events:null,
  quiet_months_count:row.quiet_months,
  reported_quiet_month_rate_pct:row.reported_quiet_comeback_rate_pct,
  money_effect_observed:false,association_is_causal:false,
  population_first_paid_release_median:null,
  actual_paid_order_revenue:null,net_publisher_profit:null,
  causal_major_update_effect:null,market_zero_paid_sale_fraction:null
 });
}

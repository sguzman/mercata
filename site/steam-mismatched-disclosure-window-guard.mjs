// Guard against treating opt-in Steam game postmortems with incompatible windows as sampled income data.
// This helper accepts synthetic fixtures only: no app IDs, platform accounts, player data or actual game rows.
const windows=new Set(['first_week','about_one_month','a_little_over_two_weeks']);
const stages=new Set(['author_label_net_undefined_stage','total_revenue_not_including_returns_chargebacks_vat','not_disclosed']);
export function auditSyntheticLaunchDisclosureWindows(rows){
 if(!Array.isArray(rows)||rows.length<2||rows.length>12)throw new TypeError('Synthetic launch windows required');
 const allowed=new Set(['fixture_id','window','units','returns','revenue_cents','revenue_stage']);
 if(rows.some((r,i)=>!r||Array.isArray(r)||typeof r!=='object'||Object.keys(r).some(k=>!allowed.has(k))||
  typeof r.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(r.fixture_id)||!windows.has(r.window)||
  !Number.isSafeInteger(r.units)||r.units<0||!(r.returns===null||Number.isSafeInteger(r.returns)&&r.returns>=0&&r.returns<=r.units)||
  !(r.revenue_cents===null||Number.isSafeInteger(r.revenue_cents)&&r.revenue_cents>=0)||
  !stages.has(r.revenue_stage)||
  (r.revenue_stage==='not_disclosed')!==(r.revenue_cents===null)))
  throw new TypeError('Malformed or untrusted synthetic disclosure');
 if(new Set(rows.map(r=>r.fixture_id)).size!==rows.length)throw new RangeError('Duplicate synthetic fixture');
 const sameWindow=rows.every(r=>r.window===rows[0].window);
 const sameFinancialStage=rows.every(r=>r.revenue_stage===rows[0].revenue_stage&&r.revenue_cents!==null);
 return Object.freeze({
  number_of_selected_fixtures:rows.length,
  same_reporting_window:sameWindow,
  same_reported_financial_stage:sameFinancialStage,
  sampled_paid_release_population:false,
  published_positive_sale_examples:rows.filter(r=>r.units>0).length,
  descriptive_total_units_if_same_window:sameWindow?rows.reduce((a,r)=>a+r.units,0):null,
  descriptive_total_revenue_cents_if_same_window_and_financial_stage:sameWindow&&sameFinancialStage?rows.reduce((a,r)=>a+r.revenue_cents,0):null,
  representative_first_paid_game_median:null,
  representative_developer_bank_income:null,
  actual_zero_paid_sale_fraction:null,
  matched_wishlist_conversion:null
 });
}

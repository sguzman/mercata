// Pure synthetic arithmetic consistency audit. No actual game rows, paid models, accounts or persons.
const allowed=new Set(['fixture_id','reported_game_count','reported_mean_usd','reported_total_usd']);
export function auditSyntheticVendorMeanTotal(row){
 if(!row||typeof row!=='object'||Array.isArray(row)||Object.keys(row).some(k=>!allowed.has(k))||
  typeof row.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(row.fixture_id)||
  !Number.isSafeInteger(row.reported_game_count)||row.reported_game_count<1||
  !Number.isFinite(row.reported_mean_usd)||row.reported_mean_usd<0||
  !Number.isFinite(row.reported_total_usd)||row.reported_total_usd<0||
  row.reported_mean_usd>1e12||row.reported_total_usd>1e16)
  throw new TypeError('Expected bounded synthetic game count, mean and total');
 const reconstructed=row.reported_game_count*row.reported_mean_usd;
 const implied=row.reported_total_usd/row.reported_game_count;
 const relative=row.reported_total_usd?Math.abs(reconstructed-row.reported_total_usd)/row.reported_total_usd:reconstructed===0?0:null;
 return Object.freeze({
  reconstructed_total_usd:reconstructed,
  implied_mean_usd:implied,
  total_minus_reconstructed_usd:row.reported_total_usd-reconstructed,
  relative_discrepancy_vs_total:relative,
  gap_larger_than_fifteen_percent:relative===null?null:relative>0.15,
  original_data_error_proven:false,
  actual_merchants_paid_orders:null,verified_gross_income_distribution:null,
  legal_publisher_bank_median:null,zero_paid_sale_fraction:null
 });
}

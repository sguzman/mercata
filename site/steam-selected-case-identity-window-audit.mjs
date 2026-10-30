// Audit only the public, deliberately selected developer-case crosswalk. Not a cohort sales estimator.
const allowed=new Set(['game_key','game_name','app_id','first_paid_date','reported_units','window_label',
 'reported_gross_usd','reported_author_net_usd','reported_undefined_total_revenue_usd','net_stage',
 'report_type','reported_zero_sales_interval','verified_merchant_sales','verified_legal_partner_cash',
 'verified_developer_profit','source_file','source_id','claim_id']);
const date=v=>{
 if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v))return false;
 const d=new Date(v+'T00:00:00Z');return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===v;
};
const money=x=>x===null||typeof x==='number'&&Number.isFinite(x)&&x>=0;
export function auditSelectedSteamPublicCaseCrosswalk(rows){
 if(!Array.isArray(rows)||rows.length<2||rows.length>24)throw new TypeError('Nonempty selected public game cases required');
 const appids=new Set(),cases=new Set();let lastDate=null;
 for(const r of rows){
  if(!r||typeof r!=='object'||Array.isArray(r)||Object.keys(r).some(k=>!allowed.has(k))||
    typeof r.game_key!=='string'||!/^[_a-z0-9]+$/.test(r.game_key)||cases.has(r.game_key)||
    typeof r.game_name!=='string'||!r.game_name.trim()||
    !Number.isSafeInteger(r.app_id)||r.app_id<=0||appids.has(r.app_id)||
    !date(r.first_paid_date)||(lastDate!==null&&r.first_paid_date<lastDate)||
    !Number.isSafeInteger(r.reported_units)||r.reported_units<=0||
    typeof r.window_label!=='string'||!r.window_label||
    !money(r.reported_gross_usd)||!money(r.reported_author_net_usd)||!money(r.reported_undefined_total_revenue_usd)||
    !(r.net_stage===null||typeof r.net_stage==='string'&&r.net_stage.length>0)||
    (r.reported_author_net_usd===null)!==(r.net_stage===null)||
    !['first_person','second_person'].includes(r.report_type)||
    typeof r.reported_zero_sales_interval!=='boolean'||
    r.verified_merchant_sales!==false||r.verified_legal_partner_cash!==false||r.verified_developer_profit!==false||
    typeof r.source_file!=='string'||!/^ontology\/steam\/[a-z0-9-]+\.json$/.test(r.source_file)||
    typeof r.source_id!=='string'||!r.source_id.startsWith('steam-')||
    typeof r.claim_id!=='string'||!r.claim_id.startsWith('steam-'))
    throw new TypeError('Malformed selected disclosure or unsupported financial/merchant claim');
  cases.add(r.game_key);appids.add(r.app_id);lastDate=r.first_paid_date;
 }
 return Object.freeze({
   selected_distinct_positive_report_games:appids.size,
   first_person_reports:rows.filter(r=>r.report_type==='first_person').length,
   second_person_reports:rows.filter(r=>r.report_type==='second_person').length,
   disclosed_zero_sale_intervals:rows.filter(r=>r.reported_zero_sales_interval).length,
   comparable_fixed_reporting_windows:rows.every(r=>r.window_label===rows[0].window_label),
   money_stages_comparable:false,
   valid_inference_of_population_median:false,
   verified_paid_order_distribution:null,verified_bank_cash_distribution:null,
   actual_zero_paid_sale_fraction:null,verified_after_cost_profit:null
 });
}

// Pure public-regulatory-timeline guard; never accept user/child identity or merchant records.
const validDate=x=>{
 if(typeof x!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(x))return false;
 const y=new Date(x+'T00:00:00Z');
 return Number.isFinite(y.valueOf())&&y.toISOString().slice(0,10)===x;
};
export function auditSteamAustraliaR18AgeGate(x={}){
 if(!x||typeof x!=='object'||Array.isArray(x)||
    Object.keys(x).some(k=>!['jurisdiction','date','rating'].includes(k)))
  throw new TypeError('Only public jurisdiction, calendar date and rating inputs permitted');
 const {jurisdiction,date,rating}=x;
 if(typeof jurisdiction!=='string'||!['AU','other'].includes(jurisdiction)||
    typeof rating!=='string'||!['R18+','other','unknown'].includes(rating)||
    !validDate(date))throw new TypeError('Use a valid public rating, ISO day and jurisdiction');
 if(date>'2026-10-29')throw new RangeError('Cannot extrapolate beyond public source observation date');
 const history=date>='2025-10-01'&&date<='2026-03-31';
 const scoped=jurisdiction==='AU'&&rating==='R18+'&&
  date>='2026-09-09'&&date<='2026-10-29';
 return {kind:'public_australian_regulatory_scope_not_customer_eligibility_or_sales_estimate',
  report_observation_period_applies:jurisdiction==='AU'&&history?true:null,
  australian_R18_store_age_gate_in_documented_window:scoped?true:null,
  steam_credit_card_check_reported_for_AU_R18:scoped?true:null,
  outside_source_scope_means_unregulated:false,
  verified_actual_customer_age:null,individual_purchase_allowed:null,
  paid_order_completion_rate:null,publisher_suspension_probability:null,
  lost_gross_sales:null,developer_after_cost_profit:null,
  caveat:'A report about 2025-26 Steam/Chat practices is not a snapshot of all post-September 2026 controls. No child-level or merchant data are used.'};
}

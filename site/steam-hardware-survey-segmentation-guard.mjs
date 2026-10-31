// Steam's optional, anonymous hardware/language survey is NOT a buyer census.
// All inputs are fixed public percentage aggregates; real account and payment records prohibited.
const own=(x,fields)=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&
 Object.keys(x).every(k=>fields.includes(k));
const month=s=>typeof s==='string'&&/^\d{4}-(0[1-9]|1[0-2])$/.test(s);
const day=s=>{
 if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;
 const d=new Date(s+'T00:00:00Z');
 return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===s;
};
const basis=x=>Number.isSafeInteger(x)&&x>=0&&x<=10000;
export function auditSteamPublicSurveyComposition(input={}){
 if(!own(input,['survey_month','observed_on','mode','platform_view','os_platform_share_basis_points',
  'selected_language_share_basis_points'])||
  !month(input.survey_month)||!day(input.observed_on)||
  input.survey_month>input.observed_on.slice(0,7)||
  input.mode!=='optional_anonymous'||
  input.platform_view!=='combined'||
  !own(input.os_platform_share_basis_points,['windows','linux','osx'])||
  !['windows','linux','osx'].every(k=>basis(input.os_platform_share_basis_points[k]))||
  !own(input.selected_language_share_basis_points,
   ['english','simplified_chinese','russian','japanese','spanish_latin_america'])||
  !['english','simplified_chinese','russian','japanese','spanish_latin_america']
    .every(k=>basis(input.selected_language_share_basis_points[k])))
  throw new TypeError('Explicit public survey month, combined OS and selected language basis points required');
 const os=input.os_platform_share_basis_points,lang=input.selected_language_share_basis_points;
 const osTotal=os.windows+os.linux+os.osx;
 const languageSubtotal=Object.values(lang).reduce((s,x)=>s+x,0);
 if(osTotal!==10000)
  throw new RangeError('Combined operating system top-level shares must total 100.00 percent');
 if(languageSubtotal>10000)
  throw new RangeError('Selected disjoint language shares cannot exceed all survey observations');
 return Object.freeze({
  kind:'public_optional_hardware_survey_composition_not_paying_customer_counts',
  survey_month:input.survey_month,observed_on:input.observed_on,
  mode:input.mode,platform_view:input.platform_view,
  os_platform_share_basis_points:{...os},
  selected_language_share_basis_points:{...lang},
  selected_language_subtotal_basis_points:languageSubtotal,
  unlisted_languages_combined_basis_points:10000-languageSubtotal,
  non_english_survey_language_share_basis_points:10000-lang.english,
  combined_os_shares_reconciled:true,
  selected_language_rows_are_an_exhaustive_named_table:false,
  os_subversion_shares_may_be_added_to_platform_totals:false,
  operating_system_is_a_purchase_country:false,
  language_is_a_purchase_country:false,
  survey_respondents_are_verified_paying_customers:false,
  actual_survey_respondent_count:null,
  matched_platform_monthly_active_users:null,
  monthly_unique_paying_customer_counts:null,
  total_buyer_spend_by_platform:null,
  publisher_income_by_survey_segment:null,
  localization_caused_paid_sales:null,
  individual_demographics_inferred:false,
  merchant_or_account_data_processed:false,
  caveat:'OS and language percentages are an optional anonymous monthly Steam Hardware & Software Survey snapshot. They are not a random paid-buyer cohort or geolocation, do not share a proven denominator with Steamworks active-user marketing figures, and cannot estimate unique purchasers, game sales or developer earnings.'
 });
}

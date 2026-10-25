// Pure safeguards for source-authorized country panels; never fetches private creator data.
const isoDate = s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&
 !Number.isNaN(Date.parse(s))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
export function validateOwnerCountryPanel(model,req){
 if(!req || typeof req!=='object')return {ready:false,reason:'missing_owner_request'};
 if(req.researchPurpose!=='viewer_country_estimated_revenue')return {ready:false,reason:'not_a_creator_residence_income_study'};
 if(req.ownerAuthorized!==true||req.yppApproved!==true||req.monetaryScopeGranted!==true)
  return {ready:false,reason:'owner_monetary_access_and_ypp_required'};
 if(typeof req.channelId!=='string'||!req.channelId.trim())
  return {ready:false,reason:'missing_single_owner_channel'};
 if(!isoDate(req.startDate)||!isoDate(req.endDate)||req.startDate>req.endDate)
  return {ready:false,reason:'invalid_date_window'};
 if(!/^[A-Z]{3}$/.test(req.currency||''))return {ready:false,reason:'missing_reporting_currency'};
 if(!Array.isArray(req.viewerCountries)||req.viewerCountries.length<2||
 new Set(req.viewerCountries).size!==req.viewerCountries.length||
 req.viewerCountries.some(x=>!model.country_codes.includes(x)))
  return {ready:false,reason:'distinct_named_viewer_countries_required'};
 if(!model.public_observations.length){
  return {ready:true,report_dimensions:model.source_data.country_report_dimensions,
   country_codes:[...req.viewerCountries],period:[req.startDate,req.endDate],
   metric_names:model.source_data.metric_names,observed_country_revenue:null,
   creator_residence_income:null,actual_creator_profit:null};
 }
 return {ready:false,reason:'unexpected_nonempty_public_report_verify_provenance'};
}
export function compareCreatorResidenceIncome(model,req){
 return {allowed:false,reason:'no_representative_creator_residence_cohort_in_public_evidence',
   creator_median_income:null,creator_zero_earner_share:null,creator_profit:null};
}
export function adjustCreatorConsumptionPPP(model,req){
 if(!model.purchasing_power.data_retrieved||!model.purchasing_power.actual_ppp_by_country_year)
  return {allowed:false,reason:'missing_dated_private_consumption_ppp_and_real_income',adjusted_income:null};
 return {allowed:false,reason:'no_verified_personal_net_cash_income_panel',adjusted_income:null};
}

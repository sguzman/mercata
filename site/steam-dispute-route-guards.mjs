// Route-tagging for synthetic policy classifications only, never legal advice or real cases.
const ROUTES=Object.freeze({
 copyright_notice:{kind:'rights_holder_allegation_intake',may_reveal_notice_identity:true,statutory_counter_notice_route:false},
 qualifying_512g_counter_notice:{kind:'conditional_us_statutory_process',may_reveal_notice_identity:true,statutory_counter_notice_route:true},
 trademark_complaint:{kind:'separate_trademark_reporting',may_reveal_notice_identity:null,statutory_counter_notice_route:false},
 steamworks_support_ticket:{kind:'partner_support_contact',may_reveal_notice_identity:null,statutory_counter_notice_route:false},
 store_build_review_rejection:{kind:'store_technical_or_content_approval',may_reveal_notice_identity:null,statutory_counter_notice_route:false},
 voluntary_app_retirement:{kind:'publisher_initiated_delisting',may_reveal_notice_identity:null,statutory_counter_notice_route:false}
});
export function classifySyntheticSteamRightsDisputeRoutes(rows){
 if(!Array.isArray(rows))throw new TypeError('Expected synthetic dispute route fixtures');
 const seen=new Set(),classified=[];
 for(const row of rows){
  if(!row||typeof row!=='object'||typeof row.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(row.fixture_id))throw new TypeError('Only synthetic fixture IDs accepted');
  if(seen.has(row.fixture_id))throw new RangeError('Duplicate synthetic dispute fixture');
  seen.add(row.fixture_id);
  if(typeof row.route!=='string'||!Object.hasOwn(ROUTES,row.route))throw new TypeError('Unrecognized legal or platform support route');
  classified.push({fixture_id:row.fixture_id,route:row.route,...ROUTES[row.route],
   conditional_us_business_day_range:row.route==='qualifying_512g_counter_notice'?[10,14]:null,
   actual_removal_status:null,guaranteed_game_reinstatement:false,
   reported_store_sales:null,actual_publisher_profit:null});
 }
 return {kind:'synthetic_public_procedure_classification_no_real_legal_cases',scenarios:classified,
  actual_platform_dispute_rate:null,actual_successful_appeal_rate:null,
  actual_income_loss:null,independent_appeal_guaranteed:false,
  note:'A U.S. section 512(g) statutory conditional window is not a universal game reinstatement commitment.'};
}

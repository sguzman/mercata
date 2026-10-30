// Public SteamForecast SOURCE audit, not a causal estimator. Every count/row is a
// labeled synthetic example or a documented, publicly printed aggregate.
const safe=n=>Number.isSafeInteger(n)&&n>=0;
export function auditSyntheticSteamForecastPanel(x){
 const keys=["fixture_id","selected_rows","quality_B","quality_C","quality_D",
   "log_example_cents","log_example_reported","report_localization_min",
   "dataset_localization_min","model_has_verified_merchant_sales"];
 if(!x||typeof x!=="object"||Array.isArray(x)||Object.keys(x).some(k=>!keys.includes(k))||
  typeof x.fixture_id!=="string"||!/^fixture-[a-z0-9-]+$/.test(x.fixture_id))
  throw new TypeError("Only labeled synthetic study-field comparisons accepted");
 for(const k of ["selected_rows","quality_B","quality_C","quality_D","log_example_cents",
 "report_localization_min","dataset_localization_min"])
  if(!safe(x[k]))throw new TypeError("Invalid count or field value: "+k);
 if(x.model_has_verified_merchant_sales!==false)
  throw new TypeError("Published study lacks authenticated transaction outcomes");
 if(x.log_example_cents<=0||typeof x.log_example_reported!=="number"||!Number.isFinite(x.log_example_reported))
  throw new TypeError("Invalid displayed log sample");
 if(x.quality_B+x.quality_C+x.quality_D!==x.selected_rows)
  throw new RangeError("Quality buckets do not partition selected rows");
 return {selected_modelled_rows:x.selected_rows,
  quality_source_counts_match:true,
  log_field_matches_natural_within_rounding:Math.abs(Math.log(x.log_example_cents)-x.log_example_reported)<0.0001,
  log_field_matches_base10_within_rounding:Math.abs(Math.log10(x.log_example_cents)-x.log_example_reported)<0.0001,
  public_localization_threshold_disagrees:x.report_localization_min!==x.dataset_localization_min,
  publicly_identified_paid_game_launch_median:null,actual_merchant_firstweek_gross:null,
  causal_paid_sales_effect:null,developer_net_income:null,
  observed_zero_paid_sale_fraction:null,actual_studio_profit:null};
}
